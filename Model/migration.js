const { RoleModel, UserModel } = require("../Model");
const { DataTypes } = require("sequelize");
const db = require("./dbConnect");

const queryInterface = db.getQueryInterface();
queryInterface.changeColumn("news", "status", {
  type: DataTypes.INTEGER,
  defaultValue: 0,
  allowNull: false,
});

db.sync();
