const { Router } = require("express");
const {
  GalleryController,
} = require("../../controllers/gallery/gallery.controller");
const {
  GalleryValidator,
} = require("../../validators/gallery/gallery.validator");
const { expressValidate } = require("../../validators");

const GalleryRouter = Router();

GalleryRouter.post(
  "/create",
  GalleryValidator.create(),
  expressValidate,
  GalleryController.create
);

GalleryRouter.get("/get-all", GalleryController.getAll);

// RESTful API - DELETE /gallery/:id
GalleryRouter.delete(
  "/:id",
  GalleryValidator.delete(),
  expressValidate,
  GalleryController.delete
);

module.exports = { GalleryRouter };
