const { DataTypes } = require("sequelize");
const db = require("./dbConnect");

const queryInterface = db.getQueryInterface();
queryInterface.addColumn("reviews", "title", {
  type: DataTypes.STRING,
  allowNull: false,
});

db.sync();
