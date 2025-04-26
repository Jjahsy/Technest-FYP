const sequelize = require("../config/database");
const User = require("./user");
const Product = require("./product");
const Order = require("./order");

// ✅ Associations
User.hasMany(Order, { foreignKey: "userId", onDelete: "CASCADE" });
Product.hasMany(Order, { foreignKey: "productId", onDelete: "CASCADE" });
Order.belongsTo(User, { foreignKey: "userId" });
Order.belongsTo(Product, { foreignKey: "productId" });

module.exports = { sequelize, User, Product, Order };
