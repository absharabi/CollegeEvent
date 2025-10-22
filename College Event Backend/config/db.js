// config/db.js
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: "mysql",
    logging: false,
  }
);

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ MySQL Database connected successfully using Sequelize.");
  })
  .catch((error) => {
    console.error("❌ Unable to connect to the database:", error);
  });

module.exports = sequelize;
