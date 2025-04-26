const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded; // Token se user data set ho gaya

      next(); // Pass control
    } catch (error) {
      return res.status(401).json({ message: "Invalid Token" });
    }
  } else {
    return res.status(401).json({ message: "No token, not authorized" });
  }
};

module.exports = protect;
