const jwt = require("jsonwebtoken");
const multer = require("multer");
const storageImages = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "." + file.originalname.split(".")[1]);
  },
});

const multi_upload_Images = multer({
  storage: storageImages,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error("Chỉ cho phép file có đuôi .png, .jpg and .jpeg !");
      err.name = "ExtensionError";
      return cb(err);
    }
  },
}).array("images", 10);

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
  uploadImages: (req, res, next) => {
    multi_upload_Images(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        res
          .status(500)
          .json({
            message: `Chỉ được phép tải lên tối đa 10 ảnh một lần`,
          })
          .end();
        return;
      } else if (err) {
        // An unknown error occurred when uploading.
        if (err.name == "ExtensionError") {
          res.status(413).json({ message: err.message }).end();
        } else {
          res
            .status(500)
            .json({
              message: `unknown uploading error: ${err.message}`,
            })
            .end();
        }
        return;
      }

      // Everything went fine.
      // show file `req.files`
      // show body `req.body`
      console.log(req.body);
      if (!req.files) {
        res
          .status(500)
          .json({
            message: `Dữ liệu gửi đi không hợp lệ`,
          })
          .end();
        return;
      }
      next();
    });
  },
};

module.exports = middlewareController;
