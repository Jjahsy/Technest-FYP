const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

// ✅ Token Generator Function
const generateToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,  // Include the role in the token
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }  // Token expires in 7 days
  );
};

// ✅ Signup Controller (No extra hashing)
const signup = async (req, res) => {
  try {
    console.log("🟢 Signup Request Received:", req.body);
    
    const { name, email, password, role } = req.body;
    
    console.log("🟢 Plain Password (Before Saving):", password);
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "❌ User already exists" });
    }

    // ✅ No extra hashing, Sequelize will hash it
    const newUser = await User.create({ name, email, password, role });
    
    console.log("✅ Saved Hashed Password in DB:", newUser.password);
    
    const token = generateToken(newUser);
    res.status(201).json({
      message: "✅ User registered successfully",
      user: {
        user_id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      token,
    });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ message: "❌ Server error", error });
  }
};

// ✅ Login Controller (Password check fixed)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "❌ Invalid credentials (User Not Found)" });
    }

    console.log("🔍 Entered Password:", password);
    console.log("🔍 Hashed Password from DB:", user.password);

    // ✅ Compare entered password with correctly stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: "❌ Invalid credentials (Password Incorrect)" });
    }

    const token = generateToken(user);

    // ✅ Send the token, along with user details (including role) in the response
    res.status(200).json({
      message: "✅ Login successful",
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role  // Send the role along with the token
      }
    });
  } catch (error) {
    console.error("❌ Login Server Error:", error);
    res.status(500).json({ message: "❌ Server error", error });
  }
};

// ✅ Export Controllers
module.exports = { login, signup };
