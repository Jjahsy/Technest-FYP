const User = require("../models/user");
const Product = require("../models/product");

// ✅ Get All Users (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["user_id", "name", "email", "role"]
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// ✅ Update Product (Admin)
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, stock, description } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.description = description || product.description;

    const updatedProduct = await product.save();
    res.status(200).json({ message: "✅ Product updated successfully!", updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Delete Product (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();
    res.status(200).json({ message: "✅ Product deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

// ✅ Update User Role (Admin)
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ["admin", "customer"];
    if (!validRoles.includes(role.toLowerCase())) {
      return res.status(400).json({ message: "Invalid role type. Must be 'admin' or 'customer'." });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role.toLowerCase();
    await user.save();

    res.status(200).json({ message: "✅ User role updated successfully!", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

// ✅ Delete User (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    res.status(200).json({ message: "✅ User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};
