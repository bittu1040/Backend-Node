import express from 'express';
const router = express.Router();
import authMiddleware from '../middleware/authMiddleware.js';
import FoodPreference from '../models/FoodPreference.js';


// ➤ Add a new food preference
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    const food = new FoodPreference({ userId, name });
    await food.save();
    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ➤ Get all food preferences for a user
router.get("/list", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const foods = await FoodPreference.find({ userId });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ➤ Delete a food preference
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await FoodPreference.findByIdAndDelete(id);
    res.json({ message: "Food preference deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
