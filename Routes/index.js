const express = require("express");
const authRoutes = express.Router();
const verifyRoutes = express.Router();
const newsRoutes = express.Router();
const cateRoutes = express.Router();
const paymentRoutes = express.Router();

//middleware
const middlewareController = require("../Controller/middlewareController");

//Controller
const UserController = require("../Controller/UserController");
const VerifyCodeController = require("../Controller/VerifyCodeController");
const NewsController = require("../Controller/NewsController");
const categoryController = require("../Controller/categoryController");
const PaymentController = require("../Controller/PaymentController");

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
cateRoutes.get("/news", categoryController.getAllCategoryNews);

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

module.exports = {
  authRoutes,
  verifyRoutes,
  newsRoutes,
  cateRoutes,
  paymentRoutes,
};
