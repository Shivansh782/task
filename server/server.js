import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes (Use import syntax for ES modules)
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Task Manager API is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
