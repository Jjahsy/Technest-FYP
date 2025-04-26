const express = require("express");
const orderController = require("../controllers/orderController");
const protect = require("../middlewares/protect");         // 👈 Protect middleware
const adminOnly = require("../middlewares/adminOnly");     // 👈 Admin check middleware

const router = express.Router();

// ✅ Debugging Check
if (!orderController || !orderController.placeOrder) {
  console.error("❌ orderController.placeOrder is undefined!");
}

// ✅ User Routes (Sirf Logged-in Users Ke Liye)
router.post("/place", protect, orderController.placeOrder);
router.get("/my-orders", protect, orderController.getUserOrders);

// ✅ Admin Routes (Sirf Admin Ke Liye)
router.get("/all", protect, adminOnly, orderController.getAllOrders);
router.put("/update/:id", protect, adminOnly, orderController.updateOrderStatus);
router.delete("/delete/:id", protect, adminOnly, orderController.deleteOrder);

module.exports = router;
