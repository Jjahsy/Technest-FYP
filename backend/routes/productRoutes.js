const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

// Add New Product
router.post("/", productController.addProduct);


// Get All Products
router.get("/", productController.getProducts);

// Get Single Product by Product ID
router.get("/:product_id", productController.getProductById); // Updated here

// Update Product by Product ID
router.put("/:product_id", productController.updateProduct); // Updated here

// Delete Product by Product ID
router.delete("/:product_id", productController.deleteProduct); // Updated here

module.exports = router;
