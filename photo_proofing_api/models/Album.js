const mongoose = require("mongoose");

const AlbumSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    tags: {
      type: Array,
      trim: true,
      required: true,
    },
    cover: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    updatedAt: {
      type: Date,
    },
    invites: [
      {
        email: {
          type: String,
          trim: true,
          minlength: 2,
          maxlength: 100,
          required: true,
        },
        watermarked: {
          type: Boolean,
          default: true,
        },
        done: {
          type: Boolean,
          default: false,
        },
        downloadableImages: {
          type: Array,
          default: [],
        },
        comment: {
          type: String,
          trim: true,
          maxlength: 1000,
        },
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { collection: "Album" }
);

AlbumSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  this.tags = this.tags[0].replace(/\s/g, "").split(","); //Tar bort whitespace och splittar på kommatecken;
  this.tags = this.tags.filter((tag) => tag !== ""); //Tar bort tomma taggar
  //ta bort dubletter
  this.tags = this.tags.filter((tag, index, self) => {
    return self.indexOf(tag) === index;
  });

  next();
});

module.exports = mongoose.model("Album", AlbumSchema);
