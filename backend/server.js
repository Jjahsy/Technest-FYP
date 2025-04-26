const express = require("express");
const cors = require("cors");
const xss = require("xss-clean");
const compression = require("compression");
const sequelize = require("./config/database");
const path = require('path'); // For serving static files like images

// Import Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

const accessoriesRoutes = require("./routes/accessories");
const app = express();

// ✅ CORS Middleware (Allow only frontend to access)
app.use(cors({
  origin: "http://localhost:3000", // Frontend allowed
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Security & Optimization Middlewares
app.use(express.json());  // JSON parsing for handling POST data
app.use(xss());           // XSS Protection to sanitize input
app.use(compression());   // Response Compression to reduce size of responses

// Serve static images from 'public/images' directory
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/accessories", accessoriesRoutes);

// Debugging Middleware: Log all incoming requests
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// ✅ Database Sync: Synchronizing Sequelize Models with Database
sequelize.sync({ alter: true })
  .then(() => console.log("🟢 Database Synced!"))
  .catch(err => console.error("🔴 Sync Error:", err));

// ✅ Fix: Signup Route (For testing purposes)
app.post("/api/auth/signup", (req, res) => {
  console.log("🟢 Signup API Hit!", req.body);  // ✅ Debugging
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: "❌ All fields are required!" });
  }
  res.status(201).json({ message: "Signup Successful!", user: req.body });
});

// ✅ Server Listening on Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🟢 Server running on port ${PORT}`));
