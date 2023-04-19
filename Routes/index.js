const express = require("express");
const authRoutes = express.Router();
const verifyRoutes = express.Router();
const newsRoutes = express.Router();

//middleware
const middlewareController = require("../Controller/middlewareController");

//Controller
const UserController = require("../Controller/UserController");
const VerifyCodeController = require("../Controller/VerifyCodeController");
const NewsController = require("../Controller/NewsController");

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
authRoutes.post("/register", UserController.registerUser);

//VerifyCode route
verifyRoutes.post("/create", VerifyCodeController.createVerifyCode);

//News route
newsRoutes.get("/", middlewareController.verifyToken, NewsController.getNews);
newsRoutes.get("/hot", NewsController.getNewsHot);
newsRoutes.get("/:id", NewsController.getDetailsNews);

newsRoutes.post(
  "/create",
  middlewareController.verifyToken,
  middlewareController.uploadImages,
  NewsController.createNews,
);

newsRoutes.delete(
  "/delete/:id",
  middlewareController.verifyToken,
  NewsController.deleteNews,
);

module.exports = {
  authRoutes,
  verifyRoutes,
  newsRoutes,
};
