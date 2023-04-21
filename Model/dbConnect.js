const { Sequelize } = require("sequelize");

const db = new Sequelize(
  "bdsnpcox_danahome",
  "bdsnpcox_lxcdb",
  "lexuanchau2001",
  {
    host: "free02.123host.vn",
    dialect: "mysql",
    logging: true,
    timezone: "+07:00", // for writing to database
  },
);

const connect = async () => {
  try {
    await db.authenticate();
    console.log("Connection to database successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

connect();

module.exports = db;
