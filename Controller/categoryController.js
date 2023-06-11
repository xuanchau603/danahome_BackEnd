const {
  CateRoomModel,
  CateNewsModel,
  UserModel,
  NewsModel,
  PaymentModel,
} = require("../Model");

const categoryController = {
  getAllCategoryRooms: async (req, res) => {
    try {
      const listCategoryRooms = await CateRoomModel.findAll();
      res.status(200).json({
        message: "Thành công",
        data: listCategoryRooms,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi server",
      });
    }
  },
  CreateCategoryRoom: async (req, res) => {
    try {
      const name = req.body.name;
      await CateRoomModel.create({
        name,
      });
      res.status(200).json({
        message: "Tạo mới loại bất động sản thành công",
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi server",
      });
    }
  },
  UpdateCategoryRoom: async (req, res) => {
    try {
      const id = req.body.id;
      const name = req.body.name;
      await CateRoomModel.update(
        {
          name,
        },
        {
          where: {
            ID: id,
          },
        },
      );
      res.status(200).json({
        message: "Cập nhật loại bất động sản thành công",
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi server",
      });
    }
  },
  DeleteCategoryRoom: async (req, res) => {
    try {
      const id = req.body.id;
      await CateRoomModel.destroy({
        where: {
          ID: id,
        },
      });
      res.status(200).json({
        message: "Xóa loại bất động sản thành công",
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi server",
      });
    }
  },
  getAllCategoryNews: async (req, res) => {
    try {
      const listCategoryNews = await CateNewsModel.findAll();
      res.status(200).json({
        message: "Thành công",
        data: listCategoryNews,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi server",
      });
    }
  },
  CreateCategoryNews: async (req, res) => {
    try {
      const name = req.body.name;
      const price = req.body.price;
      await CateNewsModel.create({
        name,
        price,
      });
      res.status(200).json({
        message: "Tạo mới loại tin thành công",
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi server",
      });
    }
  },
  UpdateCategoryNews: async (req, res) => {
    try {
      const id = req.body.id;
      const name = req.body.name;
      const price = req.body.price;
      await CateNewsModel.update(
        {
          name,
          price,
        },
        {
          where: {
            ID: id,
          },
        },
      );
      res.status(200).json({
        message: "Cập nhật loại tin thành công",
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi server",
      });
    }
  },
  DeleteCategoryNews: async (req, res) => {
    try {
      const id = req.body.id;
      await CateNewsModel.destroy({
        where: {
          ID: id,
        },
      });
      res.status(200).json({
        message: "Xóa loại tin thành công",
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi server",
      });
    }
  },

  Statistics: async (req, res) => {
    try {
      const total_User = await UserModel.count();
      const total_Vip_User = await UserModel.count({
        where: {
          type: 1,
        },
      });
      const total_News = await NewsModel.count();
      const total_Active_News = await NewsModel.count({
        where: {
          status: 2,
        },
      });
      const total_Expired_News = await NewsModel.count({
        where: {
          status: 3,
        },
      });
      const listSalesAmout = await PaymentModel.findAll({
        attributes: ["amount"],
      });

      const sales_Amount = listSalesAmout.reduce(
        (accumulator, currentValue) => {
          return accumulator + currentValue.dataValues.amount;
        },
        0,
      );

      res.status(200).json({
        message: "Thành công",
        total_User,
        total_Vip_User,
        total_News,
        total_Active_News,
        total_Expired_News,
        sales_Amount,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi server",
      });
    }
  },
};

module.exports = categoryController;
