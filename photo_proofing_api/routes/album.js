const express = require("express"); // Express web server framework
const router = express.Router(); // Router för express
const Album = require("../models/Album"); // Album model
const Photo = require("../models/Photo"); // Photo model
const verify = require("../verifyToken"); // Verify token
const { createAlbumValidation } = require("../validation"); // Validering
const fs = require("fs"); // File system

//Hämta alla album
router.get("/", verify, async (req, res) => {
  try {
    const albums = await Album.find();
    res.status(200).json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

//hämta med id
router.get("/:id", verify, async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    res.status(200).json(album);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

//hämta album baserad på invite email det delats till  (för customers)
router.get("/email/:email", verify, async (req, res) => {
  try {
    const albums = await Album.find({
      invites: {
        $elemMatch: {
          email: req.params.email,
        },
      },
    });
    res.status(200).json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

//hämta alla med foreign key owner
router.get("/user/:id", verify, async (req, res) => {
  try {
    const albums = await Album.find({ owner: req.params.id });
    res.status(200).json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

//Skapa nytt album
router.post("/", verify, async (req, res) => {
  //Ladda upp fil om req.files finns
  if (req.files) {
    const file = req.files.file;
    //Spara fil till path
    file.mv(
      `${__dirname}/../../photo_proofing_app/public/Images/AlbumCovers/${req.body.cover}`,
      async (err) => {
        if (err) {
          return res.status(500).json({ Error: err });
        }
      }
    );
  }
  //Joi validering
  const { error } = createAlbumValidation(req.body);
  if (error) return res.status(400).json(error.details[0].message); //Om något går fel

  const album = new Album({
    name: req.body.name,
    description: req.body.description,
    tags: req.body.tags,
    cover: req.body.cover,
    owner: req.body.owner,
  });

  try {
    const newAlbum = await album.save();
    res.status(200).json({ Created: newAlbum._id });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

//Raderar ett album
router.delete("/:id", verify, async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    await Album.deleteOne({
      _id: req.params.id,
    });
    fs.unlink(
      `${__dirname}/../../photo_proofing_app/public/Images/AlbumCovers/${album.cover}`,
      (err) => {
        if (err) throw err;
      }
    );
    const photos = await Photo.find({ album: req.params.id });
    //cascade radera bilder
    await Photo.deleteMany({
      album: req.params.id,
    });
    for (let i = 0; i < photos.length; i++) {
      //Radera fotografi-filer som finns i raderat album
      fs.unlink(
        `${__dirname}/../../photo_proofing_app/public/Images/Photos/${photos[i].name}`,
        (err) => {
          if (err) throw err;
        }
      );
      fs.unlink(
        `${__dirname}/../../photo_proofing_app/public/Images/Watermarked/wm_${photos[i].name}`,
        (err) => {
          if (err) throw err;
        }
      );
    }
    res.json({ Removed: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

//Uppdaterar ett album
router.patch("/:id", verify, async (req, res) => {
  try {
    if (req.files) {
      //Ladda upp Album Cover
      if (req.body.cover) {
        const file = req.files.file;
        file.mv(
          `${__dirname}/../../photo_proofing_app/public/Images/AlbumCovers/${req.body.cover}`,
          async (err) => {
            if (err) {
              return res.status(500).json({ Error: err });
            }
          }
        );
      }
      //Ta bort bildfilen om den finns
      if (req.body.oldCover) {
        fs.unlinkSync(
          `${__dirname}/../../photo_proofing_app/public/Images/AlbumCovers/${req.body.oldCover}`
        );
      }
    }
    //Hitta album och uppdatera med nya värden beroende på den data som skickats med
    const album = await Album.findById(req.params.id);
    req.body.name ? (album.name = req.body.name) : null;
    req.body.description ? (album.description = req.body.description) : null;
    req.body.tags ? (album.tags = req.body.tags) : null;
    req.body.cover ? (album.cover = req.body.cover) : null;
    req.body.owner ? (album.owner = req.body.owner) : null;
    req.body.done
      ? (album.done = album.invites.map((invite) => {
          if (invite.email === req.body.email) {
            invite.done = req.body.done;
            invite.comment = req.body.comment;
          }
        }))
      : null;
    req.body.allowDownload
      ? (album.done = album.invites.map((invite) => {
          if (invite.email === req.body.email) {
            invite.downloadableImages = "hi";
          }
        }))
      : null;
    //Lägger till ny email i arrayen med data
    req.body.addEmail
      ? album.invites.push({
          email: req.body.addEmail.email,
          watermarked: req.body.addEmail.watermarked,
        })
      : null;
    //Tar bort en email från arrayen med data
    req.body.removeEmail
      ? (album.invites = album.invites.filter(
          (invite) => invite.email !== req.body.removeEmail.email
        ))
      : null;
    //sätter watermarked till det motsatta värdet(boolean)
    req.body.toggleWatermark
      ? (album.invites = album.invites.map((invite) => {
          if (invite.email === req.body.toggleWatermark.email) {
            invite.watermarked = !invite.watermarked;
          }
          return invite;
        }))
      : null;
    req.body.photos ? (album.photos = req.body.photos) : null;
    await album.save();
    res.json({ Updated: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

module.exports = router;
