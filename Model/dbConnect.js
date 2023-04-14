const { Sequelize } = require("sequelize");

const db = new Sequelize("db_danahome", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: true,
  timezone: "+07:00", // for writing to database
});

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
