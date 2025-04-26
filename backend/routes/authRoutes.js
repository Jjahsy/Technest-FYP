const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");  
const { validateSignup, validateUserRegistration } = require("../middlewares/validateMiddleware");
const User = require("../models/user");  // ✅ FIX: User model import kiya
const router = express.Router();
const bcrypt = require("bcryptjs");

// ✅ Signup Route
router.post("/signup", authController.signup);

// ✅ Register Route
router.post("/register", validateUserRegistration, authController.signup);

// ✅ Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ where: { email } });  // ✅ FIX: Sequelize ka proper syntax

      if (!user) {
          return res.status(400).json({ message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
          return res.status(400).json({ message: "Invalid credentials (Password Incorrect)" });
      }

      res.status(200).json({ message: "Login successful", user });

  } catch (error) {
      console.error("Error during login:", error);  
      res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
