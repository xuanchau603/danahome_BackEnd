const { DataTypes } = require("sequelize");
const db = require("./dbConnect");

const queryInterface = db.getQueryInterface();
queryInterface.addColumn("users", "amount", {
  type: DataTypes.FLOAT,
  allowNull: false,
  defaultValue: 0,
});

db.sync();
