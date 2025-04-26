const express = require("express");
const router = express.Router();
const { getAllUsers, updateUserRole, deleteUser } = require("../controllers/UserController");

router.get("/users", getAllUsers);
router.put("/users/:id", updateUserRole);
router.delete("/users/:id", deleteUser); // ✅ Added DELETE route

module.exports = router;
