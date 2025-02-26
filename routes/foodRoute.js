const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Food = require("../models/Food");

const router = express.Router();

// Add Food
router.post("/add", authMiddleware, async (req, res) => {
  const { name, quantity } = req.body;

  try {
    const newFood = new Food({
      user: req.user.id,
      name,
      quantity,
    });

    const food = await newFood.save();
    res.json(food);
  } catch (error) {
    console.error("Add Food Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete Food
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) return res.status(404).json({ message: "Food item not found" });

    if (food.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    await food.deleteOne();
    res.json({ message: "Food item removed" });
  } catch (error) {
    console.error("Delete Food Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// List All Food
router.get("/list", authMiddleware, async (req, res) => {
  try {
    const foods = await Food.find({ user: req.user.id }).sort({ date: -1 });
    res.json(foods);
  } catch (error) {
    console.error("List Food Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;