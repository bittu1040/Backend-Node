const express = require("express");
const { verifySupabaseToken } = require("../middleware/supabaseAuthMiddleware");
const Task = require("../models/Task");

const router = express.Router();

// ➤ Add Task
router.post("/add", verifySupabaseToken, async (req, res) => {
  const { title, dueDate } = req.body;

  try {
    const taskData = {
      user: req.user.id,
      title,
    };

    if (dueDate) {
      taskData.dueDate = new Date(dueDate);
    }

    const newTask = new Task(taskData);
    const task = await newTask.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Add Task Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ➤ List All Tasks
router.get("/list", verifySupabaseToken, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ date: -1 });
    res.json(tasks);
  } catch (error) {
    console.error("List Tasks Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ➤ Mark Task as Done or Not Done
router.patch("/done/:id", verifySupabaseToken, async (req, res) => {
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
router.delete("/delete/:id", verifySupabaseToken, async (req, res) => {
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

// ➤ Update Task (title and/or dueDate)
router.patch("/update/:id", verifySupabaseToken, async (req, res) => {
  try {
    const { title, dueDate } = req.body;
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Update fields if provided
    if (title !== undefined) {
      task.title = title.trim();
    }
    
    if (dueDate !== undefined) {
      task.dueDate = dueDate ? new Date(dueDate) : null;
    }

    await task.save();
    
    res.json({
      message: "Task updated successfully",
      task: task
    });
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ➤ Task Statistics
router.get("/stats", verifySupabaseToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const totalTasks = await Task.countDocuments({ user: userId });
    const doneTasks = await Task.countDocuments({ user: userId, done: true });
    const pendingTasks = await Task.countDocuments({ user: userId, done: false });

    // Due date statistics
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    const overdueTasks = await Task.countDocuments({
      user: userId,
      done: false,
      dueDate: { $lt: today }
    });
    
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    const dueTodayTasks = await Task.countDocuments({
      user: userId,
      done: false,
      dueDate: { $gte: startOfToday, $lte: today }
    });

    res.json({
      total: totalTasks,
      done: doneTasks,
      pending: pendingTasks,
      overdue: overdueTasks,
      dueToday: dueTodayTasks,
    });
  } catch (error) {
    console.error("Task Statistics Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
