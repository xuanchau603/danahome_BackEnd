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
        name: name,
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
      const total_Normal_User = total_User - total_Vip_User;
      const total_Admin_Account = await UserModel.count({
        where: {
          role_Id: "d8a56e49-6819-11ee-812d-ecf4bbc11824",
        },
      });
      
      const total_News = await NewsModel.count();
      const total_Vip_News = await NewsModel.count({
        where: {
          categorys_News_Id: "d9006c26-6cf0-11ee-812d-ecf4bbc11824",
        },
      });
      const total_Normal_News = total_News - total_Vip_News;
      const total_Vip_Active_News = await NewsModel.count({
        where: {
          status: 2,
          categorys_News_Id: "d9006c26-6cf0-11ee-812d-ecf4bbc11824",
        },
      });
      const total_Vip_Expired_News = await NewsModel.count({
        where: {
          status: 3,
          categorys_News_Id: "d9006c26-6cf0-11ee-812d-ecf4bbc11824",
        },
      });
      const total_Normal_Active_News = await NewsModel.count({
        where: {
          status: 2,
          categorys_News_Id: "964b839f-681e-11ee-812d-ecf4bbc11824",
        },
      });
      const total_Normal_Expired_News = await NewsModel.count({
        where: {
          status: 3,
          categorys_News_Id: "964b839f-681e-11ee-812d-ecf4bbc11824",
        },
      });

      const total_Motel = await CateRoomModel.count({
        where: {
          ID: "d5edb92e-681e-11ee-812d-ecf4bbc11824",
        },
      });
      
      const total_House = await CateRoomModel.count({
        where: {
          ID: "4c1ea538-6cf3-11ee-812d-ecf4bbc11824",
        },
      });

      const total_Apartment = await CateRoomModel.count({
        where: {
          ID: "d5edd16c-681e-11ee-812d-ecf4bbc11824",
        },
      });

      const total_News_Motel = await NewsModel.count({
        where: {
          category_Rooms_Id: "d5edb92e-681e-11ee-812d-ecf4bbc11824",
        },
      });
      
      const total_News_House = await NewsModel.count({
        where: {
          category_Rooms_Id: "4c1ea538-6cf3-11ee-812d-ecf4bbc11824",
        },
      });

      const total_News_Apartment = await NewsModel.count({
        where: {
          category_Rooms_Id: "d5edd16c-681e-11ee-812d-ecf4bbc11824",
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
        total_Normal_User,
        total_Admin_Account,
        total_News,
        total_Vip_News,
        total_Vip_Active_News,
        total_Vip_Expired_News,
        total_Normal_News,
        total_Normal_Active_News,
        total_Normal_Expired_News,
        total_Motel,
        total_House,
        total_Apartment,
        total_News_Motel,
        total_News_House,
        total_News_Apartment,
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
