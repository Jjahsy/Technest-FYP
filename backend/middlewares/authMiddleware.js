const jwt = require("jsonwebtoken");
require("dotenv").config();

// ✅ Middleware: Verify JWT Token
exports.protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("🔴 No token found in headers");
      return res.status(401).json({ message: "Access denied, no token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access denied, invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.user_id) {
      console.log("🔴 JWT Token Missing user_id!");
      return res.status(400).json({ message: "Invalid token payload" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("🔴 JWT Error:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// ✅ Middleware: Admin Access Only
exports.adminOnly = (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(401).json({ message: "Unauthorized - No user found or role missing" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only" });
  }

  next();
};
