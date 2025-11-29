const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
    logging: false,
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    timezone: "+05:30",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection has been established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database.");
    console.error("Sequelize connection error details:", {
      message: error.message,
      originalError: error.original?.sqlMessage || "No original error message.",
      db_user: process.env.DB_USER,
      db_host: process.env.DB_HOST,
    });
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
