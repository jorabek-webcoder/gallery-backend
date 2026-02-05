const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { HttpException } = require("./http-exception");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "public/uploads/others";
    if (file.mimetype.startsWith("image/")) folder = "public/uploads/images";
    if (file.mimetype.startsWith("video/")) folder = "public/uploads/videos";

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    // Image uchun 20MB, video uchun 50MB limit
    const maxSize = file.mimetype.startsWith("image/") 
      ? 20 * 1024 * 1024  // 20MB
      : 50 * 1024 * 1024; // 50MB
    
    req.fileMaxSize = maxSize; // Keyinchalik tekshirish uchun
    cb(null, true);
  } else {
    cb(
      new HttpException(
        400,
        "Faqat rasm va video fayllar qabul qilinadi"
      )
    );
  }
};

// Multer uchun maksimal limit - eng katta fayl (video)
const uploadFile = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Umumiy max limit
  fileFilter,
});

module.exports = { uploadFile };
