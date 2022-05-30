const express = require("express"); // Express web server framework
const router = express.Router(); // Router för express
const Photo = require("../models/Photo"); // Album model
const verify = require("../verifyToken"); // Verify token
const Jimp = require("jimp");
const fs = require("fs"); // File system

//Jimp function
const watermarkImage = async (fileName, image, watermark) => {
  let watermarkImage = await Jimp.read(watermark);
  let jimpImage = await Jimp.read(image);
  jimpImage = jimpImage.quality(60);
  const imageWidth = jimpImage.bitmap.width;
  const imageHeight = jimpImage.bitmap.height;
  watermarkImage = watermarkImage.resize(imageWidth / 2, Jimp.AUTO);
  const x = imageWidth - watermarkImage.bitmap.width * 1.5;
  const y = imageHeight - watermarkImage.bitmap.height * 1.1;

  jimpImage.composite(watermarkImage, x, y, {
    mode: Jimp.BLEND_SOURCE_OVER,
    opacityDest: 1,
    opacitySource: 0.7,
  });
  await jimpImage.writeAsync(
    `${__dirname}/../../photo_proofing_app/public/Images/Watermarked/${fileName}`
  );
};

router.get("/", verify, async (req, res) => {
  try {
    const photos = await Photo.find();
    res.status(200).json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

//Download images
router.get("/download", verify, async (req, res) => {
  try {
    const photos = await Photo.find();
    res.status(200).json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

//hämta med id
router.get("/:id", verify, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    res.status(200).json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

//hämta alla med foreign key album
router.get("/album/:id", verify, async (req, res) => {
  try {
    const photo = await Photo.find({ album: req.params.id });
    res.status(200).json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

router.post("/", verify, async (req, res) => {
  //Om req.files är satt
  if (req.files) {
    const photosArray = [];
    if (req.files.file.length > 1) {
      //Om flera filer
      for (let i = 0; i < req.files.file.length; i++) {
        //check file type
        if (
          req.files.file[i].mimetype === "image/jpeg" ||
          req.files.file[i].mimetype === "image/png" ||
          req.files.file[i].mimetype === "image/jpg" ||
          req.files.file[i].mimetype === "image/gif" ||
          req.files.file[i].mimetype === "image/bmp" ||
          req.files.file[i].mimetype === "image/tiff"
        ) {
          const file = req.files.file[i];
          file.mv(
            `${__dirname}/../../photo_proofing_app/public/Images/Photos/${req.body.fileName[i]}`,
            async (err) => {
              if (err) {
                return res.status(500).json({ Error: err });
              }
            }
          );
          watermarkImage(
            "wm_" + req.body.fileName[i],
            `${__dirname}/../../photo_proofing_app/public/Images/Photos/${req.body.fileName[i]}`,
            `${__dirname}/../../photo_proofing_app/public/Images/watermark.png`
          );

          //Pushar varje bild till array
          const photo = new Photo({
            name: req.body.fileName[i],
            watermarked: req.body.watermarked[i],
            album: req.body.album[i],
            owner: req.body.owner[i],
          });
          photosArray.push(photo);
        }
      }
    } else {
      //Om endast en fil, ingen loop och inget i-värde
      const file = req.files.file;
      if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/gif" ||
        file.mimetype === "image/bmp" ||
        file.mimetype === "image/tiff"
      ) {
        file.mv(
          `${__dirname}/../../photo_proofing_app/public/Images/Photos/${req.body.fileName}`,
          async (err) => {
            if (err) {
              return res.status(500).json({ Error: err });
            }
          }
        );
        watermarkImage(
          "wm_" + req.body.fileName,
          `${__dirname}/../../photo_proofing_app/public/Images/Photos/${req.body.fileName}`,
          `${__dirname}/../../photo_proofing_app/public/Images/watermark.png`
        );
        const photo = new Photo({
          name: req.body.fileName,
          watermarked: req.body.watermarked,
          album: req.body.album,
          owner: req.body.owner,
        });
        photosArray.push(photo);
      }
    }
    //Tar bild-data och skickar till databasen
    Photo.insertMany(photosArray, (err, photos) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.status(200).json(photos);
      }
    });
  } else {
    return res.status(400).json({ Error: "No file" });
  }
});

//Radera alla med id som finns med i medskickad array
router.delete("/many", verify, async (req, res) => {
  try {
    const photos = await Photo.find({ _id: { $in: req.body.ids } });
    photos.forEach((photo) => {
      photo.remove();
      //Ta bort filen samt watermark varianten
      try {
        fs.unlinkSync(
          `${__dirname}/../../photo_proofing_app/public/Images/Photos/${photo.name}`
        );
        fs.unlinkSync(
          `${__dirname}/../../photo_proofing_app/public/Images/Watermarked/wm_${photo.name}`
        );
      } catch (error) {
        console.log(error);
      }
    });
    res.json({ Removed: req.body.ids });
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

//Raderar en
router.delete("/:id", verify, async (req, res) => {
  try {
    const deletePhoto = await Photo.where("_id", req.params.id);
    await Photo.where("_id", req.params.id).deleteOne();
    //Ta bort filen samt watermark varianten
    try {
      fs.unlinkSync(
        `${__dirname}/../../photo_proofing_app/public/Images/Photos/${deletePhoto[0].name}`
      );
      fs.unlinkSync(
        `${__dirname}/../../photo_proofing_app/public/Images/Watermarked/wm_${deletePhoto[0].name}`
      );
    } catch (error) {
      console.log(error);
    }
    res.json({ Removed: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

//radera alla med userID
router.delete("/user/:id", verify, async (req, res) => {
  try {
    const deletePhotos = await Photo.where("owner", req.params.id);
    await Photo.where("owner", req.params.id).deleteMany();
    deletePhotos.forEach((photo) => {
      try {
        fs.unlinkSync(
          `${__dirname}/../../photo_proofing_app/public/Images/Photos/${photo.name}`
        );
        fs.unlinkSync(
          `${__dirname}/../../photo_proofing_app/public/Images/Watermarked/wm_${photo.name}`
        );
      } catch (error) {
        console.log(error);
      }
    });
    res.json({ Removed: "All from User " + req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

//radera alla med albumID
router.delete("/album/:id", verify, async (req, res) => {
  try {
    const deletePhotos = await Photo.where("album", req.params.id);
    await Photo.where("album", req.params.id).deleteMany();
    deletePhotos.forEach((photo) => {
      try {
        fs.unlinkSync(
          `${__dirname}/../../photo_proofing_app/public/Images/Photos/${photo.name}`
        );
        fs.unlinkSync(
          `${__dirname}/../../photo_proofing_app/public/Images/Watermarked/wm_${photo.name}`
        );
      } catch (error) {
        console.log(error);
      }
    });
    res.json({ Removed: "All from Album " + req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

router.patch("/:id", verify, async (req, res) => {
  try {
    //Upload photo
    if (req.files) {
      const file = req.files.file;
      file.mv(
        `${__dirname}/../../photo_proofing_app/public/Images/Photos/${req.body.fileName}`,
        async (err) => {
          if (err) {
            return res.status(500).json({ Error: err });
          }
        }
      );
    }
    const photo = await Photo.findById(req.params.id);
    req.body.name ? (photo.name = req.body.name) : null;
    req.body.name ? (photo.watermark = "wm_" + req.body.name) : null;
    req.body.album ? (photo.album = req.body.album) : null;
    req.body.owner ? (photo.owner = req.body.owner) : null;

    // if user has liked photo, add user id to liked array else remove user id from liked array
    if (req.body.like) {
      if (photo.likes.length > 0) {
        for (let i = 0; i < photo.likes.length; i++) {
          if (photo.likes[i].userID === req.body.like.userID) {
            photo.likes.userID.pull(req.body.like.userID);
            photo.likes.email.pull(req.body.like.email);
          } else {
            photo.likes.push({
              userID: req.body.like.userID,
              email: req.body.like.email,
            });
          }
        }
      } else {
        photo.likes.push({
          userID: req.body.like.userID,
          email: req.body.like.email,
        });
      }
    }
    await photo.save();
    res.json({ Updated: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

module.exports = router;
