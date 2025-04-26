// ✅ backend/controllers/adminStatsController.js
const db = require("../config/database");

const getAdminSummary = async (req, res) => {
  try {
    const [userRows] = await db.promise().query("SELECT COUNT(*) as totalUsers FROM users");
    const [productRows] = await db.promise().query("SELECT COUNT(*) as totalProducts FROM products");
    const [orderRows] = await db.promise().query("SELECT COUNT(*) as totalOrders, SUM(total) as totalRevenue FROM orders");

    const summary = {
      totalUsers: userRows[0].totalUsers || 0,
      totalProducts: productRows[0].totalProducts || 0,
      totalOrders: orderRows[0].totalOrders || 0,
      totalRevenue: orderRows[0].totalRevenue || 0,
    };

    res.json(summary);
  } catch (error) {
    console.error("📛 Failed to fetch admin summary:", error);
    res.status(500).json({ error: "Failed to fetch admin summary" });
  }
};

module.exports = { getAdminSummary };
