const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

console.log("Loaded .env values:");
console.log("DB:", process.env.MYSQL_DB);
console.log("USER:", process.env.MYSQL_USER);
console.log("HOST:", process.env.MYSQL_HOST);
console.log("PORT:", process.env.MYSQL_PORT);

async function testConnection() {
  try {
    // Connect without specifying database to ensure it exists
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      port: Number(process.env.MYSQL_PORT) || 3306,
    });

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DB}\``);
    console.log(`✅ Database '${process.env.MYSQL_DB}' ensured!`);

    // Connect to the database
    await connection.changeUser({ database: process.env.MYSQL_DB });
    console.log("✅ MySQL connection successful!");

    await connection.end();
  } catch (err) {
    console.error("❌ MySQL connection failed:", err);
  }
}

testConnection();
