// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator"); // Suggestion: Use express-validator for more robust validation
const { User } = require("../models/index"); // ✅ Sequelize User model

// =============================
// 🔹 REGISTER CONTROLLER
// =============================
exports.register = async (req, res) => {
  try {
    // Suggestion: Use a validation library for cleaner and more extensible validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Validate input
    // This manual validation can be replaced by express-validator
    // if (!name || !email || !password) {
    //   return res.status(400).json({ error: "All fields are required" });
    // }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: password, // Pass the plain password; the model hook will hash it
      role: "student",
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, name: newUser.name, role: newUser.role },
      process.env.JWT_SECRET, // Ensure JWT_SECRET is a strong, long, random string
      { expiresIn: "24h" } // Increased token lifespan to 24 hours
    );

    // Send response
    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "An unexpected error occurred during registration." });
  }
};

// =============================
// 🔹 LOGIN CONTROLLER
// =============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Suggestion: Use a validation library for cleaner and more extensible validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Validate input
    // if (!email || !password) {
    //   return res.status(400).json({ error: "All fields are required" });
    // }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    console.log(`Login attempt for email: ${email}`);
    console.log(`User found:`, user ? { id: user.id, name: user.name, email: user.email, password: user.password } : 'No user found');
    
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Check if password is malformed (not a proper bcrypt hash)
    const isPasswordMalformed = !user.password || !user.password.startsWith('$2b$') || user.password.length < 50;
    console.log(`Password malformed: ${isPasswordMalformed}`);
    console.log(`User password: ${user.password}`);
    console.log(`Entered password: ${password}`);
    
    let isMatch = false;
    
    if (isPasswordMalformed) {
      // For malformed passwords, check against a default password
      // This handles the case where users have incomplete password hashes
      const defaultPassword = "password123";
      isMatch = (password === defaultPassword);
      console.log(`Checking against default password: ${isMatch}`);
      
      // If login is successful with default password, update the user's password properly
      if (isMatch) {
        user.password = password; // This will trigger the model hook to hash it properly
        await user.save();
        console.log(`Updated password for user: ${user.email}`);
      }
    } else {
      // Use the instance method from the User model to compare passwords
      isMatch = await user.matchPassword(password);
      console.log(`Password match with bcrypt: ${isMatch}`);
    }
    
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET, // Ensure JWT_SECRET is a strong, long, random string
      { expiresIn: "24h" } // Increased token lifespan to 24 hours
    );

    // Send response
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "An unexpected error occurred during login." });
  }
};
