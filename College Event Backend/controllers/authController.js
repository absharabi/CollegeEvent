// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator"); // Suggestion: Use express-validator for more robust validation
const { User } = require("../models"); // ✅ Sequelize User model

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

    // Hash password - Suggestion: Use a salt round value from environment variables
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, name: newUser.name, role: newUser.role },
      process.env.JWT_SECRET, // Ensure JWT_SECRET is a strong, long, random string
      { expiresIn: "1h" }
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
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // ✅ Compare plain password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET, // Ensure JWT_SECRET is a strong, long, random string
      { expiresIn: "1h" }
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
