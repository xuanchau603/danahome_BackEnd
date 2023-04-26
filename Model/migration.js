const { DataTypes } = require("sequelize");
const db = require("./dbConnect");

const queryInterface = db.getQueryInterface();
queryInterface.changeColumn("users", "role_Id", {
  type: DataTypes.UUID,
  allowNull: false,
  defaultValue: "e4bae67b-e413-11ed-99e0-ecf4bbc11824",
});

db.sync({ alter: true });
