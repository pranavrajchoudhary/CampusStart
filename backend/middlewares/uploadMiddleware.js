const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "community_uploads", // folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "mp4", "mov"],
    resource_type: "auto", // auto-detects image/video
  },
});

const upload = multer({ storage });
module.exports = upload;
