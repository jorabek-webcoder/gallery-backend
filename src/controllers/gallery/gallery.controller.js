const { StatusCodes } = require("http-status-codes");
const { UploadModel } = require("../../models/upload/upload.model");
const { HttpException } = require("../../utils/http-exception");
const { GalleryModel } = require("../../models/gallery/gallery.model");
const { asyncHandler } = require("../../utils/async-handler");

class GalleryController {
  static create = asyncHandler(async (req, res) => {
    const { url, file_type } = req.body;
    const uploadItem = await UploadModel.findOne({ url });

    if (!uploadItem || !uploadItem.url) {
      throw new HttpException(StatusCodes.BAD_REQUEST, "Fayl topilmadi");
    }

    if (uploadItem.is_use) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "Fayl allaqachon ishlatilmoqda"
      );
    }

    await GalleryModel.create({ url, file_type });
    await UploadModel.updateOne({ url }, { is_use: true });

    res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: "Fayl gallereyaga qo'shildi" });
  });

  static getAll = asyncHandler(async (req, res) => {
    const { file_type } = req.query;

    let filter = {};

    if (file_type) {
      filter.file_type = file_type;
    }

    const galleryData = await GalleryModel.find(filter);

    res.status(StatusCodes.OK).json({ success: true, data: galleryData });
  });

  static delete = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Gallery dan topish
    const item = await GalleryModel.findById(id);

    if (!item) {
      throw new HttpException(
        StatusCodes.NOT_FOUND,
        "Gallereyada bunday fayl topilmadi"
      );
    }

    // Upload modelda is_use ni false qilish (fayl o'chirilmaydi)
    const uploadItem = await UploadModel.findOne({ url: item.url });

    if (uploadItem) {
      await UploadModel.findByIdAndUpdate(uploadItem._id, { is_use: false });
    }

    // Gallereyadan o'chirish
    await GalleryModel.findByIdAndDelete(id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Fayl gallereyadan o'chirildi",
      info: "Fizik fayl cron job orqali tozalanadi",
    });
  });
}

module.exports = { GalleryController };
