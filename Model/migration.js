const { DataTypes } = require("sequelize");
const db = require("./dbConnect");

const queryInterface = db.getQueryInterface();
queryInterface.changeColumn("news", "status", {
  type: DataTypes.INTEGER,
  defaultValue: 1,
  allowNull: false,
});

db.sync({ alter: true });
