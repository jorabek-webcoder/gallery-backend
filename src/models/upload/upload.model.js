const { Schema, model } = require("mongoose");

const UploadSchema = new Schema(
  {
    url: { type: String, required: true },
    is_use: { type: Boolean, default: false },
    file_size: { type: Number }, // Fayl hajmi (bytes)
    file_name: { type: String }, // Original fayl nomi
    mime_type: { type: String }, // image/jpeg, video/mp4
    file_hash: { type: String, unique: true, sparse: true }, // Duplicate check uchun
  },
  { timestamps: true, versionKey: false }
);

const UploadModel = model("upload", UploadSchema, "upload");

module.exports = { UploadModel };
