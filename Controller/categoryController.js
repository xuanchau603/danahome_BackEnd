const { CateRoomModel, CateNewsModel } = require("../Model");

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
};

module.exports = categoryController;
