const { boolean, string } = require("joi");
const mongoose = require("mongoose");

const PhotoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 100,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    updatedAt: {
      type: Date,
    },
    saved: {
      saved: { type: Boolean, default: false },
      comment: { type: String, trim: true },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
    },
    liked: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        email: { type: String, trim: true, minlength: 2, maxlength: 100 },
      },
    ],
  },
  { collection: "Photo" }
);

module.exports = mongoose.model("Photo", PhotoSchema);
