const {
  UserModel,
  CateRoomModel,
  CateNewsModel,
  NewsModel,
} = require("../Model");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "." + file.originalname.split(".")[1]);
  },
});

const multi_upload = multer({
  storage,
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
      const err = new Error("Only .png, .jpg and .jpeg format allowed!");
      err.name = "ExtensionError";
      return cb(err);
    }
  },
}).array("images", 2);

const NewsController = {
  getNews: async (req, res) => {
    const news = await NewsModel.findAll({
      include: [
        {
          model: CateRoomModel,
        },
        {
          model: CateNewsModel,
        },
      ],
    });

    console.log(news[0].dataValues.expire_At - news[0].dataValues.createdAt);

    res.status(200).json({
      message: "Thành công",
      data: news,
    });
  },
  getNewsHot: async (req, res) => {
    const news = await NewsModel.findAll({
      include: [
        {
          model: CateRoomModel,
        },
        {
          model: CateNewsModel,
        },
      ],
      where: {
        categorys_News_Id: "f3a4bbd9-dc42-11ed-8c1c-2cf05ddd2632",
      },
    });

    res.status(200).json({
      message: "Thành công",
      data: news,
    });
  },
  createNews: async (req, res) => {
    const user_Id = req.user.id;
    const category_Rooms_Id = req.body.roomType;
    const categorys_News_Id = req.body.newsType;
    const province = req.body.province;
    const district = req.body.district;
    const ward = req.body.ward;
    const house_Number = req.body.house_Number;
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const acreage = req.body.acreage;
    const status = req.body.status;
    const expire_At = req.body.expire_At;

    multi_upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        res
          .status(500)
          .json({
            error: { message: `Multer uploading error: ${err.message}` },
          })
          .end();
        return;
      } else if (err) {
        // An unknown error occurred when uploading.
        if (err.name == "ExtensionError") {
          res
            .status(413)
            .json({ error: { message: err.message } })
            .end();
        } else {
          res
            .status(500)
            .json({
              error: { message: `unknown uploading error: ${err.message}` },
            })
            .end();
        }
        return;
      }

      // Everything went fine.
      // show file `req.files`
      // show body `req.body`
      res.status(200).json(req.files);
    });

    // try {
    //   const news = await NewsModel.create({
    //     province: province,
    //     district: district,
    //     ward: ward,
    //     house_Number: house_Number,
    //     title: title,
    //     description: description,
    //     price: price,
    //     acreage: acreage,
    //     status: status,
    //     expire_At: expire_At,
    //     user_Id: user_Id,
    //     category_Rooms_Id: category_Rooms_Id,
    //     categorys_News_Id: categorys_News_Id,
    //   });

    //   res.status(200).json({
    //     message: "Đăng tin thành công",
    //   });
    // } catch (error) {
    //   res.status(500).json({
    //     message: "Lỗi server",
    //   });
    // }
  },
};

module.exports = NewsController;
