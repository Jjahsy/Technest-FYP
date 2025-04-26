const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");

// ✅ Place New Order
exports.placeOrder = async (req, res) => {
  try {
    console.log("🟢 Order Request Received:", req.body);

    const { productId, quantity, paymentMethod } = req.body;
    const userId = req.user.user_id; // ✅ Extract user ID from token

    if (!userId || !productId || !quantity || !paymentMethod) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const validPayments = ["jazzcash", "easypaisa", "cod"];
    if (!validPayments.includes(paymentMethod.toLowerCase())) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const product = await Product.findByPk(Number(productId));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const totalPrice = product.price * quantity;

    const order = await Order.create({
      user_id: userId,
      product_id: productId,
      quantity,
      total_price: totalPrice,
      status: "Pending",
      payment_method: paymentMethod,
    });

    // ✅ Fetch user email
    const user = await User.findByPk(userId);
    const emailHtml = `
      <h2>🧾 Order Confirmation</h2>
      <p>Thank you for your purchase, <strong>${user.name}</strong>!</p>
      <p>🛒 Product: <strong>${product.name}</strong></p>
      <p>🔢 Quantity: <strong>${quantity}</strong></p>
      <p>💰 Total: <strong>Rs. ${totalPrice}</strong></p>
      <p>🧾 Payment: <strong>${paymentMethod.toUpperCase()}</strong></p>
      <hr />
      <p>This is your order summary. We'll notify you once it's processed.</p>
    `;

    await sendEmail(user.email, "✅ TechNest Order Confirmation", emailHtml);

    console.log("✅ Order Placed and Email Sent Successfully:", order);
    res.status(201).json({ message: "Order placed successfully! Email sent.", order });

  } catch (error) {
    console.error("❌ Error in placeOrder:", error);
    res.status(500).json({ message: "Error placing order", error: error.message });
  }
};

// ✅ Get All Orders (Admin Only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: Product, attributes: ["name", "price"] }],
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

// ✅ Get Orders of a User
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.user_id;
    if (!userId) return res.status(400).json({ message: "User ID missing from token" });

    const orders = await Order.findAll({ where: { userId } });
    if (orders.length === 0) return res.status(404).json({ message: "No orders found" });

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    res.status(500).json({ message: "Error fetching user orders", error: error.message });
  }
};

// ✅ Update Order Status (Admin Only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();
    res.status(200).json({ message: "Order status updated!", order });
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status", error: error.message });
  }
};

// ✅ Delete Order (Admin Only)
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await order.destroy();
    res.status(200).json({ message: "Order deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting order:", error);
    res.status(500).json({ message: "Error deleting order", error: error.message });
  }
};
