const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL
]
  .filter(Boolean)
  .map(url => url.replace(/\/$/, ""));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS: Origin not allowed"));
  }
}));

// Blog Schema
const blogSchema = new mongoose.Schema({
  newTitle: {
    type: String,
    required: true
  },
  newContent: {
    type: String,
    required: true
  },
  date: {
    type: String,
    default: ""
  },
  likes: {
    type: Number,
    default: 0
  }
});

const Blog = mongoose.model("Blog", blogSchema);

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Blog API is running successfully"
  });
});

// Get All Blogs
app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Get blogs error:", error);
    res.status(500).json({
      message: "Failed to fetch blogs",
      error: error.message
    });
  }
});

// Create New Blog
app.post("/api/blogs", async (req, res) => {
  try {
    const { newTitle, newContent, date, likes } = req.body;

    if (!newTitle || !newContent) {
      return res.status(400).json({
        message: "Title and content are required"
      });
    }

    const blog = new Blog({
      newTitle,
      newContent,
      date: date || new Date().toISOString(),
      likes: likes ?? 0
    });

    const newBlog = await blog.save();

    res.status(201).json(newBlog);

  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({
      message: "Failed to create blog",
      error: error.message
    });
  }
});

// Like a Blog
app.patch("/api/blogs/like/:id", async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    res.status(200).json(updatedBlog);

  } catch (error) {
    console.error("Like blog error:", error);
    res.status(500).json({
      message: "Failed to like blog",
      error: error.message
    });
  }
});

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({
    message: "API route not found"
  });
});

// Start Server after MongoDB connects
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const startServer = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is missing");
    }

    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB Connected Successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
