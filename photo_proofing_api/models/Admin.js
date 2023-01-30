const { boolean } = require("joi");
const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 100,
      required: true,
    },
    email: {
      type: String,
      length: [2, 100],
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      length: [8, 1024],
      required: true,
    },
    adminRights: {
      type: Boolean,
      default: true,
      required: true,
    },
    owner: {
      type: Boolean,
      default: true,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  { collection: "Admin" }
);

module.exports = mongoose.model("Admin", AdminSchema);
