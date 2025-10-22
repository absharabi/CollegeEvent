// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Corrected import

const User = sequelize.define("User", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  name: { 
    type: DataTypes.STRING(100), // Match VARCHAR(100)
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING(100), // Match VARCHAR(100)
    allowNull: false, 
    unique: true,
    validate: {
      isEmail: { msg: "Must be a valid email address" }
    }
  },
  password: { 
    type: DataTypes.STRING(255), // Match VARCHAR(255)
    allowNull: false 
  },
  role: { 
    type: DataTypes.ENUM("student", "organizer", "admin"), 
    defaultValue: "student" 
  },
  // Explicitly define the created_at column to set a default value
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  }
}, 
{
  // Sequelize options to match your table schema precisely
  tableName: "users",    // Match the exact table name 'users' (lowercase)
  timestamps: true,      // Enable timestamps
  updatedAt: false,      // We are not using an 'updatedAt' field
  createdAt: "created_at" // Map Sequelize's 'createdAt' to our 'created_at' column
}); 

module.exports = User;
