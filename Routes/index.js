const express = require("express");
const authRoutes = express.Router();

//middleware
const middlewareController = require("../Controller/middlewareController");

//Controller
const UserController = require("../Controller/UserController");

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
};
