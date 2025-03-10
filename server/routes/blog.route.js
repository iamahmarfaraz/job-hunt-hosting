import express from "express";
import { createBlog, getBlogs, likeBlog, unlikeBlog, updateBlog, deleteBlog, getTopContributers } from "../controllers/blog.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

// Create a blog post (Only authenticated users)
router.post("/createBlog", isAuthenticated, singleUpload, createBlog);

// Get all blog posts
router.get("/allBlog",isAuthenticated, getBlogs);

// Like a blog post
router.post("/likeBlog", isAuthenticated, likeBlog);

// Unlike a blog post
router.post("/unlikeBlog", isAuthenticated, unlikeBlog);

// Update a blog post
router.put("/updateBlog", isAuthenticated, singleUpload, updateBlog);

// Delete a blog post
router.delete("/deleteBlog", isAuthenticated, deleteBlog);

// Get Top 5 Blog Contributers
router.get("/top-contributors",isAuthenticated,getTopContributers);

export default router;
