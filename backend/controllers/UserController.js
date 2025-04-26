const { User } = require("../models"); // Sequelize User model

// ✅ Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["user_id", "name", "email", "role"]
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// ✅ Update User Role
const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    const user = await User.findOne({ where: { user_id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role || "customer";
    await user.save();

    res.json({ message: "User role updated successfully!" });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Delete User
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deleted = await User.destroy({
      where: { user_id: userId }
    });

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser // ✅ Add this line!
};
