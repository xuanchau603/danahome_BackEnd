const express = require("express");
const authRoutes = express.Router();
const verifyRoutes = express.Router();
const newsRoutes = express.Router();
const cateRoutes = express.Router();
const paymentRoutes = express.Router();
const reviewsRoutes = express.Router();
const statisticsRoutes = express.Router();

//middleware
const middlewareController = require("../Controller/middlewareController");

//Controller
const UserController = require("../Controller/UserController");
const VerifyCodeController = require("../Controller/VerifyCodeController");
const NewsController = require("../Controller/NewsController");
const categoryController = require("../Controller/categoryController");
const PaymentController = require("../Controller/PaymentController");
const reviewsController = require("../Controller/reviewsController");

//Authentication route

authRoutes.get(
  "/",
  middlewareController.verifyToken,
  UserController.getAllUser,
);
authRoutes.get(
  "/:id",
  middlewareController.verifyToken,
  UserController.getUserById,
);
authRoutes.post("/login", UserController.loginUser);
authRoutes.post(
  "/resetPassword",
  middlewareController.verifyToken,
  UserController.resetPassword,
);
authRoutes.post("/register", UserController.registerUser);
authRoutes.put(
  "/edit",
  middlewareController.verifyToken,
  middlewareController.uploadCloudAvartar,
  UserController.editUser,
);

//VerifyCode route
verifyRoutes.post("/create", VerifyCodeController.createVerifyCode);

//Category route
cateRoutes.get("/rooms", categoryController.getAllCategoryRooms);
cateRoutes.post(
  "/rooms/create",
  categoryController.CreateCategoryRoom,
);
cateRoutes.put(
  "/rooms/update",
  categoryController.UpdateCategoryRoom,
);
cateRoutes.delete(
  "/rooms/delete",
  middlewareController.verifyToken,
  categoryController.DeleteCategoryRoom,
);

cateRoutes.get("/news", categoryController.getAllCategoryNews);
cateRoutes.post(
  "/news/create",
  middlewareController.verifyToken,
  categoryController.CreateCategoryNews,
);
cateRoutes.put(
  "/news/update",
  categoryController.UpdateCategoryNews,
);
cateRoutes.delete(
  "/news/delete",
  categoryController.DeleteCategoryNews,
);

//News route
newsRoutes.get("/", NewsController.getAllNews);
newsRoutes.get("/hot", NewsController.getNewsHot);
newsRoutes.get("/:id", NewsController.getDetailsNews);

newsRoutes.post(
  "/create",
  middlewareController.verifyToken,
  middlewareController.uploadCloudImages,
  NewsController.createNews,
);
newsRoutes.put(
  "/update",
  middlewareController.verifyToken,
  middlewareController.uploadCloudImages,
  NewsController.editNews,
);
newsRoutes.delete(
  "/image/delete",
  middlewareController.verifyToken,
  NewsController.deleteImage,
);

newsRoutes.delete(
  "/delete/:id",
  middlewareController.verifyToken,
  NewsController.deleteNews,
);

//Payment route

paymentRoutes.get(
  "/:id",
  middlewareController.verifyToken,
  PaymentController.getPayment,
);

paymentRoutes.post(
  "/create",
  middlewareController.verifyToken,
  PaymentController.createPayment,
);

paymentRoutes.post(
  "/pay-with-momo",
  middlewareController.verifyToken,
  PaymentController.createPaymentMomo,
);
paymentRoutes.post(
  "/ipn-momo",
  // middlewareController.verifyToken,
  PaymentController.notifyPaymentMomo,
);
paymentRoutes.post(
  "/pay-with-vnpay",
  middlewareController.verifyToken,
  PaymentController.createPaymentVnpay,
);
paymentRoutes.post(
  "/ipn-vnpay",
  // middlewareController.verifyToken,
  PaymentController.notifyPaymentVnpay,
);

reviewsRoutes.post(
  "/create",
  middlewareController.verifyToken,
  reviewsController.CreateReview,
);

reviewsRoutes.get(
  "/",
  middlewareController.verifyToken,
  reviewsController.GetAllReviews,
);

reviewsRoutes.delete(
  "/delete/:id",
  middlewareController.verifyToken,
  reviewsController.DeleteReview,
);

statisticsRoutes.get(
  "/",
  middlewareController.verifyToken,
  categoryController.Statistics,
);

module.exports = {
  authRoutes,
  verifyRoutes,
  newsRoutes,
  cateRoutes,
  paymentRoutes,
  reviewsRoutes,
  statisticsRoutes,
};
