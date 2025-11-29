// Load environment variables
const dotenv = require("dotenv");
dotenv.config();

const bcrypt = require("bcryptjs");
const { sequelize } = require("./config/db");
const { User } = require("./models");

const fixPasswords = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established");

    // Get all users with malformed passwords
    const users = await User.findAll();
    
    console.log("Found users:");
    users.forEach(user => {
      console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Password: ${user.password}`);
    });

    // Default password for reset
    const defaultPassword = "password123";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    console.log("\n🔧 Fixing passwords...");
    
    for (const user of users) {
      // Check if password is malformed (not a proper bcrypt hash)
      if (!user.password || !user.password.startsWith('$2b$') || user.password.length < 50) {
        console.log(`Fixing password for ${user.name} (${user.email})`);
        
        // Update the user with a properly hashed password
        await user.update({ password: defaultPassword }); // The model hook will hash it
        console.log(`✅ Fixed password for ${user.name}`);
      } else {
        console.log(`✅ Password for ${user.name} is already properly hashed`);
      }
    }

    console.log("\n🎉 Password fix completed!");
    console.log("All users now have the default password: 'password123'");
    console.log("Please ask users to change their passwords after logging in.");

  } catch (error) {
    console.error("❌ Error fixing passwords:", error);
  } finally {
    await sequelize.close();
  }
};

// Run the fix
fixPasswords();
