import express from "express";
import auth from "../middleware/auth.js";
import Task from "../models/Task.js";

const router = express.Router();
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    const task = new Task({
      title,
      description,
      user: req.user._id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: errors.join(", ") });
    }
    res.status(500).json({ message: "Server error while creating task" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    task.title = title !== undefined ? title : task.title;
    task.description =
      description !== undefined ? description : task.description;
    task.completed = completed !== undefined ? completed : task.completed;

    await task.save();
    res.json(task);
  } catch (error) {
    console.error("Update task error:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: errors.join(", ") });
    }
    res.status(500).json({ message: "Server error while updating task" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Server error while deleting task" });
  }
});

export default router;
