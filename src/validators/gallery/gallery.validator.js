const { body, param } = require("express-validator");

class GalleryValidator {
  static create = () => [
    body("url").notEmpty().withMessage("URL majburiy"),
    body("url").isAscii().withMessage("To'g'ri URL formatida bo'lishi kerak"),
    body("file_type").notEmpty().withMessage("Fayl turi majburiy"),
    body("file_type")
      .isIn(["image", "video", "other"])
      .withMessage("Fayl turi: image, video yoki other bo'lishi kerak"),
  ];

  static delete = () => [
    param("id").notEmpty().withMessage("ID majburiy"),
    param("id").isMongoId().withMessage("Noto'g'ri MongoDB ID formati"),
  ];
}

module.exports = { GalleryValidator };
