// routes/accessories.js
const express = require("express");
const router = express.Router();
const Accessory = require("../models/Accessory");

// ✅ Get all accessories
router.get("/", async (req, res) => {
  try {
    const accessories = await Accessory.findAll();
    res.json(accessories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get single accessory by ID
router.get("/:id", async (req, res) => {
  try {
    const accessory = await Accessory.findByPk(req.params.id);
    if (!accessory) {
      return res.status(404).json({ error: "Accessory not found" });
    }
    res.json(accessory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Add new accessory
router.post("/", async (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    return res.status(400).json({ error: "Missing fields in request body." });
  }

  try {
    const newAccessory = await Accessory.create({ name, price, image });
    res.json(newAccessory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update accessory
router.put("/:id", async (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    return res.status(400).json({ error: "Missing fields for update." });
  }

  try {
    const accessory = await Accessory.findByPk(req.params.id);
    if (!accessory) {
      return res.status(404).json({ error: "Accessory not found" });
    }

    accessory.name = name;
    accessory.price = price;
    accessory.image = image;

    await accessory.save();
    res.json({ success: true, accessory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete accessory
router.delete("/:id", async (req, res) => {
  try {
    const accessory = await Accessory.findByPk(req.params.id);
    if (!accessory) {
      return res.status(404).json({ error: "Accessory not found" });
    }

    await accessory.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
