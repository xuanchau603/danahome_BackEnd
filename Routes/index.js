const express = require("express");
const authRoutes = express.Router();
const verifyRoutes = express.Router();

//middleware
const middlewareController = require("../Controller/middlewareController");

//Controller
const UserController = require("../Controller/UserController");
const VerifyCodeController = require("../Controller/VerifyCodeController");

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

module.exports = {
  authRoutes,
  verifyRoutes,
};

//VerifyCode route
verifyRoutes.post("/create", VerifyCodeController.createVerifyCode);
