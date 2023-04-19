const { Sequelize } = require("sequelize");

const db = new Sequelize("sql12613417", "sql12613417", "hqvQNgqRu8", {
  host: "sql12.freemysqlhosting.net",
  dialect: "mysql",
  logging: false,
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
