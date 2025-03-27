const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Task = require("../models/Task");

const router = express.Router();

// ➤ Add Task
router.post("/add", authMiddleware, async (req, res) => {
  const { title } = req.body;

  try {
    const newTask = new Task({
      user: req.user.id,
      title,
    });

    const task = await newTask.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Add Task Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ➤ List All Tasks
router.get("/list", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ date: -1 });
    res.json(tasks);
  } catch (error) {
    console.error("List Tasks Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ➤ Mark Task as Done
router.patch("/done/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    task.done = true; // Mark as done
    await task.save();
    res.json({ message: "Task marked as done", task });
  } catch (error) {
    console.error("Mark Task as Done Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ➤ Delete Task
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Delete Task Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;