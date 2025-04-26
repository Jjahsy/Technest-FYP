const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      next(); // ✅ Admin access allowed
    } else {
      return res.status(403).json({ message: "Access denied. Admins only" });
    }
  };
  
  module.exports = adminOnly;
  