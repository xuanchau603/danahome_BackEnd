const { RoleModel, UserModel } = require("../Model");
const { DataTypes } = require("sequelize");
const db = require("./dbConnect");

const queryInterface = db.getQueryInterface();
queryInterface.changeColumn("users", "image_URL", {
  type: DataTypes.STRING,
  defaultValue:
    "https://res.cloudinary.com/di5qmcigy/image/upload/v1682065006/avatar_user/285-2856724_user-avatar-enter-free-photo-user-avatar-green-removebg-preview_r828vh.png",
});

db.sync();
