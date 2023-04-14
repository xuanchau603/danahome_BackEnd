const { RoleModel, UserModel } = require("../Model");
const { DataTypes } = require("sequelize");
const db = require("./dbConnect");

const queryInterface = db.getQueryInterface();
queryInterface.changeColumn("users", "phone", {
  type: DataTypes.STRING,
  allowNull: false,
});

db.sync();
