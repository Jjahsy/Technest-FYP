const { body } = require("express-validator");

// ✅ Product Validation
exports.validateProduct = [
  body("name").notEmpty().withMessage("Product name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("category").notEmpty().withMessage("Category is required")
];

// ✅ User Role Validation
exports.validateUserRole = [
  body("role")
    .notEmpty()
    .isIn(["admin", "customer"])
    .withMessage("Role must be either admin or customer")
];
