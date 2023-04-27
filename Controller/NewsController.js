const {
  UserModel,
  CateRoomModel,
  CateNewsModel,
  NewsModel,
  ImagesModel,
} = require("../Model");
const cloudinary = require("cloudinary").v2;
const { Op } = require("sequelize");

const NewsController = {
  getAllNews: async (req, res) => {
    const orderBy = req.query.orderBy || "createdAt";
    const orderType = req.query.orderType || "DESC";

    console.log({ From: req.query.priceFrom, To: req.query.priceTo });

    const page = req.query.page - 1 || 0;
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
        [Op.and]: [
          {
            category_Rooms_Id: req.query.roomsType
              ? {
                  [Op.like]: req.query.roomsType,
                }
              : {
                  [Op.ne]: null,
                },
          },
          {
            province: req.query.province
              ? {
                  [Op.like]: req.query.province,
                }
              : {
                  [Op.ne]: null,
                },
          },
          {
            district: req.query.district
              ? {
                  [Op.like]: req.query.district,
                }
              : {
                  [Op.ne]: null,
                },
          },
          {
            ward: req.query.ward
              ? {
                  [Op.like]: req.query.ward,
                }
              : {
                  [Op.ne]: null,
                },
          },
          {
            price: req.query.priceTo
              ? {
                  [Op.and]:
                    req.query.priceFrom === req.query.priceTo
                      ? {
                          [Op.gte]: req.query.priceTo * 1000000,
                        }
                      : {
                          [Op.gte]: req.query.priceFrom * 1000000,
                          [Op.lte]: req.query.priceTo * 1000000,
                        },
                }
              : {
                  [Op.ne]: null,
                },
          },
          {
            acreage: req.query.acreageTo
              ? {
                  [Op.and]:
                    req.query.acreageFrom === req.query.acreageTo
                      ? {
                          [Op.gte]: req.query.acreageTo,
                        }
                      : {
                          [Op.gte]: req.query.acreageFrom,
                          [Op.lte]: req.query.acreageTo,
                        },
                }
              : {
                  [Op.ne]: null,
                },
          },
        ],
      },
      order: [[orderBy, orderType]],
      offset: page * 10,
      limit: 10,
    });

    const newData = news.map((item) => {
      const { category_Room, category_New, user, images, ...data } =
        item.dataValues;

      return {
        ...data,
        featured_Image: item.dataValues.images[0]?.image_URL,
        total_Image: item.dataValues.images.length,
        poster: item.dataValues.user.full_Name,
        poster_Phone: item.dataValues.user.phone,
        poster_Image_URL: item.dataValues.user.image_URL,
        roomType: item.dataValues.category_Room.name,
        newsType: item.dataValues.category_New.name,
      };
    });

    res.status(200).json({
      message: "Thành công",
      data: newData,
      currentPage: page + 1,
      totalNews: await NewsModel.count(),
    });
  },
  getNewsHot: async (req, res) => {
    const roomType = req.query.roomType;
    const page = req.query.page - 1 || 0;

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
        [Op.and]: [
          {
            category_Rooms_Id: roomType ? roomType : { [Op.ne]: null },
          },
          {
            categorys_News_Id: "b8bc8bc5-e417-11ed-99e0-ecf4bbc11824",
          },
        ],
      },
      order: [["createdAt", "DESC"]],
      offset: page,
      limit: 10,
    });

    const newData = news.map((item) => {
      const { category_Room, category_New, user, images, ...data } =
        item.dataValues;

      return {
        ...data,
        featured_Image: item.dataValues.images[0]?.image_URL,
        total_Image: item.dataValues.images.length,
        poster: item.dataValues.user.full_Name,
        poster_Phone: item.dataValues.user.phone,
        poster_Image_URL: item.dataValues.user.image_URL,
        roomType: item.dataValues.category_Room.name,
        newsType: item.dataValues.category_New.name,
      };
    });

    res.status(200).json({
      message: "Thành công",
      data: newData,
    });
  },
  getDetailsNews: async (req, res) => {
    try {
      const newsId = req.params.id;
      const news = await NewsModel.findByPk(newsId, {
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
      });
      if (news) {
        const {
          category_Rooms_Id,
          categorys_News_Id,
          category_Room,
          category_New,
          user,
          ...newData
        } = news.dataValues;

        res.status(200).json({
          message: "Thành công",
          data: {
            ...newData,
            poster: news.dataValues.user.full_Name,
            poster_Phone: news.dataValues.user.phone,
            poster_Image_URL: news.dataValues.user.image_URL,
            roomType: news.dataValues.category_Room.name,
            newsType: news.dataValues.category_New.name,
          },
        });
      } else {
        res.status(404).json({
          message: "Tin này không tồn tại",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Lỗi server",
      });
    }
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
      const object = req.body.object;
      const news = await NewsModel.create({
        province: province,
        district: district,
        ward: ward,
        house_Number: house_Number,
        title: title,
        description: description,
        price: price,
        acreage: acreage,
        status: status ? status : 0,
        expire_At: expire_At,
        user_Id: user_Id,
        category_Rooms_Id: category_Rooms_Id,
        categorys_News_Id: categorys_News_Id,
        object: object,
      });
      const listImages = req.files.map((item) => {
        return {
          news_Id: news.dataValues.ID,
          image_URL: item.path,
        };
      });
      await ImagesModel.bulkCreate(listImages);
      res.status(200).json({
        message: "Đăng tin thành công",
      });
    } catch (error) {
      for (var item of req.files) {
        cloudinary.api.delete_resources(
          item.filename,
          function (error, result) {
            if (error) {
              return res.status(501).json({
                message: error,
              });
            }
          },
        );
      }
      res.status(500).json({
        message: "Lỗi server",
      });
    }
  },
  deleteNews: async (req, res) => {
    try {
      const id = req.params.id;
      //check news
      const news = await NewsModel.findByPk(id);
      if (news) {
        const images = await ImagesModel.findAll({
          where: {
            news_Id: id,
          },
        });

        for (var item of images) {
          const path =
            item.dataValues.image_URL
              .split("https://res.cloudinary.com/di5qmcigy/image/upload/")[1]
              .split(".")[0]
              .split("/")[1] +
            "/" +
            item.dataValues.image_URL
              .split("https://res.cloudinary.com/di5qmcigy/image/upload/")[1]
              .split(".")[0]
              .split("/")[2];
          cloudinary.api.delete_resources(path, function (error, result) {
            if (error) {
              return res.status(501).json({
                message: error,
              });
            }
          });
        }

        await NewsModel.destroy({
          where: {
            ID: id,
          },
        });
        res.status(200).json({
          message: "Xóa thành công",
        });
      } else {
        res.status(404).json({
          message: "Tin này không tồn tại",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Lỗi server",
      });
    }
  },
};

module.exports = NewsController;
