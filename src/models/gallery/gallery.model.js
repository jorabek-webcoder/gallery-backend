const { Schema, model } = require("mongoose");

const GallerySchema = new Schema(
  {
    url: { type: String, required: true },
    file_type: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

const GalleryModel = model("gallery", GallerySchema, "gallery");

module.exports = { GalleryModel };
