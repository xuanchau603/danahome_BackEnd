const { DataTypes } = require("sequelize");
const db = require("./dbConnect");

const queryInterface = db.getQueryInterface();
queryInterface.addColumn("users", "VIP_Expire_At", {
  type: DataTypes.DATE,
  allowNull: false,
  defaultValue: DataTypes.NOW,
});

db.sync();
