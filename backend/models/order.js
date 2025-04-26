const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const Product = require("./product");

const Order = sequelize.define("Order", {
  order_id: {  // ✅ Explicit primary key
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  user_id: { // ✅ Match with foreignKey in association below
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: "user_id" }, // match with your User model
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Product, key: "product_id" }, // match with Product model
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: "Pending",
  },
  payment_method: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "orders",
  timestamps: true,
  underscored: true, // ✅ Enables snake_case fields
});

// ✅ Define Relationships
Order.belongsTo(Product, { foreignKey: "product_id", onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: "user_id", onDelete: 'CASCADE' });

module.exports = Order;
