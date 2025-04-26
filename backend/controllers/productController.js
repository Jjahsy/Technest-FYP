const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../models/product");

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ==========================
// ✅ Add Product
// ==========================
exports.addProduct = [
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, description, price, category } = req.body;
      const imageUrl = req.file ? `/images/${req.file.filename}` : "";

      if (!name || !description || !price || !category || !imageUrl) {
        return res.status(400).json({
          success: false,
          message: "All fields including image are required."
        });
      }

      const product = await Product.create({ name, description, price, imageUrl, category });

      res.status(201).json({
        success: true,
        message: "✅ Product added successfully!",
        product
      });
    } catch (error) {
      console.error("❌ Error adding product:", error);
      res.status(500).json({ success: false, message: "Server error", error });
    }
  }
];

// ==========================
// ✅ Get All Products
// ==========================
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ==========================
// ✅ Get Product By ID
// ==========================
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.product_id;
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ==========================
// ✅ Update Product
// ==========================
exports.updateProduct = [
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, description, price, category } = req.body;
      const product = await Product.findByPk(req.params.product_id);

      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      const newImageUrl = req.file ? `/images/${req.file.filename}` : product.imageUrl;

      // Optional: Delete old image if new one is uploaded
      if (req.file && product.imageUrl) {
        const oldImagePath = path.join(__dirname, `../public${product.imageUrl}`);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.imageUrl = newImageUrl;

      await product.save();

      res.status(200).json({
        success: true,
        message: "✅ Product updated successfully!",
        product
      });
    } catch (error) {
      console.error("❌ Error updating product:", error);
      res.status(500).json({ success: false, message: "Server error", error });
    }
  }
];

// ==========================
// ✅ Delete Product
// ==========================
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.product_id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Delete image from storage
    const imagePath = path.join(__dirname, `../public${product.imageUrl}`);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await product.destroy();

    res.status(200).json({ success: true, message: "✅ Product deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
