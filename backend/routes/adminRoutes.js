const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const adminController = require("../controllers/adminController");
const productController = require("../controllers/productController");
const orderController = require("../controllers/orderController");
const { getAdminSummary } = require("../controllers/adminStatsController");

const {
  validateProduct,
  validateUserRole
} = require("../middlewares/security");

const { validationResult } = require("express-validator");

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// 🧑‍💼 USERS
router.get("/users", protect, adminOnly, adminController.getAllUsers);
router.put("/users/:id", protect, adminOnly, validateUserRole, handleValidation, adminController.updateUserRole);
router.delete("/users/:id", protect, adminOnly, adminController.deleteUser);

// 📦 PRODUCTS
router.post("/products", protect, adminOnly, validateProduct, handleValidation, productController.addProduct);
router.put("/products/:id", protect, adminOnly, adminController.updateProduct);
router.delete("/products/:id", protect, adminOnly, adminController.deleteProduct);

// 📦 ORDERS
router.get("/orders", protect, adminOnly, orderController.getAllOrders);
router.put("/orders/:id", protect, adminOnly, orderController.updateOrderStatus);

// 📊 ADMIN SUMMARY
router.get("/summary", protect, adminOnly, getAdminSummary);

module.exports = router;
