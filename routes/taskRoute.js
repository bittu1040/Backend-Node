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

// ➤ Mark Task as Done or Not Done
router.patch("/done/:id", authMiddleware, async (req, res) => {
  try {
    const { done } = req.body;

    if (done === undefined) {
      return res.status(400).json({ message: "Missing 'done' field in request body" });
    }

    if (typeof done !== "boolean") {
      return res.status(400).json({ message: "'done must be a boolean (true or false)" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    task.done = done;
    await task.save();

    res.json({ message: `Task marked as ${done ? "done" : "not done"}`, task });
  } catch (error) {
    console.error("Update Task Status Error:", error);
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

router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const totalTasks = await Task.countDocuments({ user: userId });
    const doneTasks = await Task.countDocuments({ user: userId, done: true });
    const pendingTasks = await Task.countDocuments({ user: userId, done: false });

    res.json({
      total: totalTasks,
      done: doneTasks,
      pending: pendingTasks,
    });
  } catch (error) {
    console.error("Task Statistics Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
