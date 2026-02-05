const { GalleryRouter } = require("./gallery/gallery.route");
const { UploadRouter } = require("./upload/upload.route");

const mainRouter = [
  { path: "/gallery", rout: GalleryRouter },
  { path: "/upload", rout: UploadRouter },
];

module.exports = { mainRouter };
