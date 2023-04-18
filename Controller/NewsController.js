const {
  UserModel,
  CateRoomModel,
  CateNewsModel,
  NewsModel,
  ImagesModel,
} = require("../Model");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

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
          attributes: ["name"],
        },
        {
          model: CateNewsModel,
          attributes: ["name"],
        },
        {
          model: UserModel,
          attributes: ["full_Name", "phone", "image_URL"],
        },
        {
          model: ImagesModel,
          attributes: ["image_URL"],
        },
      ],
      where: {
        categorys_News_Id: "f3a4bbd9-dc42-11ed-8c1c-2cf05ddd2632",
      },
    });

    const newData = news.map((item) => {
      const { category_Room, category_New, user, images, ...data } =
        item.dataValues;

      return {
        ...data,
        featured_Image: item.dataValues.images[0].image_URL,
        total_Image: item.dataValues.images.length,
        poster: item.dataValues.user.full_Name,
        poster_Phone: item.dataValues.user.phone,
        poster_Image_URL: item.dataValues.user.Image_URL,
        roomType: item.dataValues.category_Room.name,
        newsType: item.dataValues.category_New.name,
      };
    });

    res.status(200).json({
      message: "Thành công",
      data: newData,
    });
  },
  createNews: async (req, res) => {
    const user_Id = req.user.id;

    try {
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

      const news = await NewsModel.create({
        province: province,
        district: district,
        ward: ward,
        house_Number: house_Number,
        title: title,
        description: description,
        price: price,
        acreage: acreage,
        status: status,
        expire_At: expire_At,
        user_Id: user_Id,
        category_Rooms_Id: category_Rooms_Id,
        categorys_News_Id: categorys_News_Id,
      });

      const listImages = req.files.map((item) => {
        return {
          news_Id: news.dataValues.ID,
          image_URL: `http://localhost:802/${item.destination}${item.filename}`,
        };
      });

      await ImagesModel.bulkCreate(listImages);

      res.status(200).json({
        message: "Đăng tin thành công",
      });
    } catch (error) {
      for (var item of req.files) {
        // fs.unlinkSync(item.path);
      }
      res.status(500).json({
        message: "Lỗi server",
      });
    }
  },
};

module.exports = NewsController;
