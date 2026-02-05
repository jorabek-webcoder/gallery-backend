const { StatusCodes } = require("http-status-codes");
const { HttpException } = require("../../utils/http-exception");
const { UploadModel } = require("../../models/upload/upload.model");
const { generateFileUrl } = require("../../utils/url-helper");
const { generateFileHash } = require("../../utils/file-hash");
const { cleanupUnusedFiles } = require("../../utils/cron-jobs");
const { asyncHandler } = require("../../utils/async-handler");
const path = require("path");

class UploadController {
  static uploadFile = asyncHandler(async (req, res) => {
    const uploadedFile = req.file;

    if (!uploadedFile) {
      throw new HttpException(StatusCodes.BAD_REQUEST, "Fayl yuklanmadi");
    }

    // File size tekshirish (turga qarab)
    const isImage = uploadedFile.mimetype.startsWith("image/");
    const isVideo = uploadedFile.mimetype.startsWith("video/");
    const maxImageSize = 20 * 1024 * 1024; // 20MB
    const maxVideoSize = 50 * 1024 * 1024; // 50MB

    if (isImage && uploadedFile.size > maxImageSize) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "Rasm hajmi 20MB dan oshmasligi kerak"
      );
    }

    if (isVideo && uploadedFile.size > maxVideoSize) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "Video hajmi 50MB dan oshmasligi kerak"
      );
    }

    // URL va file_type aniqlash
    let filePath = `uploads/others/${uploadedFile.filename}`;
    let file_type = "other";

    if (isImage) {
      filePath = `uploads/images/${uploadedFile.filename}`;
      file_type = "image";
    }

    if (isVideo) {
      filePath = `uploads/videos/${uploadedFile.filename}`;
      file_type = "video";
    }

    // URL yaratish (avtomatik yoki .env dan)
    const url = generateFileUrl(req, filePath);

    // Duplicate check - bir xil fayl mavjudmi?
    const fullFilePath = path.join(process.cwd(), "public", filePath);
    const fileHash = await generateFileHash(fullFilePath);

    // Agar bir xil hash bor bo'lsa, mavjud faylni qaytaramiz
    const existingFile = await UploadModel.findOne({ file_hash: fileHash });
    if (existingFile) {
      // Yangi yuklangan faylni o'chiramiz (duplicate)
      const fs = require("fs");
      fs.unlinkSync(fullFilePath);

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Bu fayl avval yuklangan",
        url: existingFile.url,
        file_type,
        file_size: existingFile.file_size,
        file_name: existingFile.file_name,
        is_duplicate: true,
      });
    }

    // Database ga saqlash
    await UploadModel.create({
      url,
      file_size: uploadedFile.size,
      file_name: uploadedFile.originalname,
      mime_type: uploadedFile.mimetype,
      file_hash: fileHash,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      url,
      file_type,
      file_size: uploadedFile.size,
      file_name: uploadedFile.originalname,
      is_duplicate: false,
    });
  });

  // Manual cleanup endpoint (Test uchun)
  static manualCleanup = asyncHandler(async (req, res) => {
    await cleanupUnusedFiles();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Tozalash jarayoni bajarildi. Terminalda natijalarni ko'ring.",
    });
  });

  // Multiple files upload
  static uploadFiles = asyncHandler(async (req, res) => {
    const uploadedFiles = req.files; // Array

    if (!uploadedFiles || uploadedFiles.length === 0) {
      throw new HttpException(StatusCodes.BAD_REQUEST, "Fayllar yuklanmadi");
    }

    const results = [];
    const errors = [];

    // Har bir faylni qayta ishlash
    for (const file of uploadedFiles) {
      try {
        // File size tekshirish
        const isImage = file.mimetype.startsWith("image/");
        const isVideo = file.mimetype.startsWith("video/");
        const maxImageSize = 20 * 1024 * 1024;
        const maxVideoSize = 50 * 1024 * 1024;

        if (isImage && file.size > maxImageSize) {
          errors.push({
            file_name: file.originalname,
            error: "Rasm hajmi 20MB dan oshmasligi kerak",
          });
          continue;
        }

        if (isVideo && file.size > maxVideoSize) {
          errors.push({
            file_name: file.originalname,
            error: "Video hajmi 50MB dan oshmasligi kerak",
          });
          continue;
        }

        // URL va file_type
        let filePath = `uploads/others/${file.filename}`;
        let file_type = "other";

        if (isImage) {
          filePath = `uploads/images/${file.filename}`;
          file_type = "image";
        }

        if (isVideo) {
          filePath = `uploads/videos/${file.filename}`;
          file_type = "video";
        }

        const url = generateFileUrl(req, filePath);

        // Duplicate check
        const fullFilePath = path.join(process.cwd(), "public", filePath);
        const fileHash = await generateFileHash(fullFilePath);

        const existingFile = await UploadModel.findOne({ file_hash: fileHash });
        if (existingFile) {
          const fs = require("fs");
          fs.unlinkSync(fullFilePath);

          results.push({
            url: existingFile.url,
            file_type,
            file_name: file.originalname,
            is_duplicate: true,
          });
          continue;
        }

        // Database ga saqlash
        await UploadModel.create({
          url,
          file_size: file.size,
          file_name: file.originalname,
          mime_type: file.mimetype,
          file_hash: fileHash,
        });

        results.push({
          url,
          file_type,
          file_name: file.originalname,
          file_size: file.size,
          is_duplicate: false,
        });
      } catch (error) {
        errors.push({
          file_name: file.originalname,
          error: error.message,
        });
      }
    }

    res.status(StatusCodes.CREATED).json({
      success: true,
      total: uploadedFiles.length,
      uploaded: results.length,
      failed: errors.length,
      results,
      errors,
    });
  });
}

module.exports = { UploadController };
