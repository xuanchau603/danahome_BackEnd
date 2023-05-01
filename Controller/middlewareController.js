const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "di5qmcigy",
  api_key: "746252528226279",
  api_secret: "bRINNLKkjMZgQkcsmJE23ON-FiM",
});

const storageImages = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png", "jpeg"],
  params: {
    folder: "danahome_images",
  },
});

const storageAvatar = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png", "jpeg"],
  params: {
    folder: "avatar_user",
  },
});

const uploadCloudImages = multer({ storage: storageImages });
const uploadCloudAvartar = multer({ storage: storageAvatar });
const upload = uploadCloudImages.array("images", 10);
const uploadAvatar = uploadCloudAvartar.single("image");

const middlewareController = {
  verifyToken: async (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const tokenType = token.split(" ")[0];
      if (!(tokenType === "Bearer")) {
        res.status(401).json({
          message: "Token type không đúng",
        });
      } else {
        const accessToken = token.split(" ")[1];
        jwt.verify(accessToken, "0802", (error, user) => {
          if (error) {
            res.status(403).json({
              message: "Token không đúng hoặc đã hết hạn",
            });
          } else {
            req.user = user;
            next();
          }
        });
      }
    } else {
      res.status(404).json({
        message: "Vui lòng cung cấp token",
      });
    }
  },
  uploadCloudImages: (req, res, next) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(401).json(err);
      } else if (err) {
        // An unknown error occurred when uploading.
        return res.status(501).json(err);
      }
      // Everything went fine.
      next();
    });
  },
  uploadCloudAvartar: (req, res, next) => {
    uploadAvatar(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(401).json(err);
      } else if (err) {
        // An unknown error occurred when uploading.
        return res.status(501).json(err);
      }
      // Everything went fine.
      next();
    });
  },
};

module.exports = middlewareController;
