const { Router } = require("express");
const { uploadFile } = require("../../utils/upload-file");
const { UploadController } = require("../../controllers/upload/upload.controller");


const UploadRouter = Router();

UploadRouter.post(
  "/file",
  uploadFile.single("file"),
  UploadController.uploadFile
);

// Multiple files upload (maksimal 10 ta fayl)
UploadRouter.post(
  "/files",
  uploadFile.array("files", 10),
  UploadController.uploadFiles
);

// Manual cleanup endpoint (Admin uchun)
UploadRouter.post("/cleanup", UploadController.manualCleanup);

module.exports = { UploadRouter };
