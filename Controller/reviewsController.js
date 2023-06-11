const { ReviewsModel, UserModel } = require("../Model");

const reviewsController = {
  CreateReview: async (req, res) => {
    try {
      const userId = req.user.id;
      const title = req.body.title;
      const description = req.body.description;
      const point = req.body.point;
      await ReviewsModel.create({
        title: title,
        description: description,
        point: point,
        user_Id: userId,
      });
      res.status(200).json({
        message: "Đánh giá thành công",
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi server",
      });
    }
  },
  GetAllReviews: async (req, res) => {
    try {
      const listReviews = await ReviewsModel.findAll({
        include: {
          model: UserModel,
        },
      });
      res.status(200).json({
        message: "Thành công",
        data: listReviews,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi server",
      });
    }
  },
  DeleteReview: async (req, res) => {
    try {
      const reviewId = req.params.id;
      await ReviewsModel.destroy({
        where: {
          ID: reviewId,
        },
      });
      res.status(200).json({
        message: "Xóa thành công",
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi server",
      });
    }
  },
};

module.exports = reviewsController;
