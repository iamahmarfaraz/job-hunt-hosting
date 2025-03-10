import { Blog } from "../models/blog.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../config/cloudinary.js";
import redisClient from "../config/redis.js"; // Redis client instance

// Create Blog Post
export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.id;

    if (!title || !content || !req.file) {
      return res
        .status(400)
        .json({ message: "All fields are required.", success: false });
    }
    

    // Upload image to Cloudinary
    const fileUri = getDataUri(req.file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const newBlog = await Blog.create({
      title,
      content,
      image: cloudResponse.secure_url,
      author: userId,
    });

    // Invalidate the blog cache since a new blog is added
    await redisClient.del("blogs");

    return res.status(201).json({
      message: "Blog post created successfully.",
      blog: newBlog,
      success: true,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    return res
      .status(500)
      .json({ message: "Failed to create blog.", success: false });
  }
};

// Get All Blog Posts (with Redis caching)
export const getBlogs = async (req, res) => {
  try {
    // Check if blogs are cached
    const cachedBlogs = await redisClient.get("blogs");
    if (cachedBlogs) {
      return res
        .status(200)
        .json({ blogs: JSON.parse(cachedBlogs), success: true });
    }

    // If not cached, fetch from DB
    const blogs = await Blog.find()
      .populate("author", "fullname email")
      .sort({ createdAt: -1 });

    // Store result in Redis with a Time limit
    await redisClient.setex("blogs", 3600, JSON.stringify(blogs));

    return res.status(200).json({
      message:"Serving from Redis Client",
      blogs,
      success: true 
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch blogs.", success: false });
  }
};

// Like Blog Post (with Redis optimization)
export const likeBlog = async (req, res) => {
  try {
    const userId = req.id;
    const { blogId } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res
        .status(404)
        .json({ message: "Blog not found.", success: false });
    }

    if (!blog.liked_by.includes(userId)) {
      blog.liked_by.push(userId);
      await blog.save();
    }

    // Invalidate the blog cache since likes changed
    await redisClient.del("blogs");
    await redisClient.del(`blog:${blogId}`);

    return res
      .status(200)
      .json({ message: "Blog liked.", blog, success: true });
  } catch (error) {
    console.error("Error liking blog:", error);
    return res
      .status(500)
      .json({ message: "Failed to like blog.", success: false });
  }
};

// Unlike Blog Post (using `$pull` and Redis)
export const unlikeBlog = async (req, res) => {
  try {
    const userId = req.id;
    const { blogId } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res
        .status(404)
        .json({ message: "Blog not found.", success: false });
    }

    // Use `$pull` to remove the user from liked_by
    await Blog.findByIdAndUpdate(blogId, { $pull: { liked_by: userId } });

    // Invalidate the blog cache since likes changed
    await redisClient.del("blogs");
    await redisClient.del(`blog:${blogId}`);

    return res.status(200).json({ message: "Blog unliked.", success: true });
  } catch (error) {
    console.error("Error unliking blog:", error);
    return res
      .status(500)
      .json({ message: "Failed to unlike blog.", success: false });
  }
};

// Update Blog Post (with Redis invalidation)
export const updateBlog = async (req, res) => {
  try {
    const { blogId, title, content } = req.body;
    const userId = req.id;

    if (!blogId) {
        return res.status(404).json({
            success:false,
            message:"BlogId is Missing"
        })
    }

    let blog = await Blog.findById(blogId);
    if (!blog) {
      return res
        .status(404)
        .json({ message: "Blog not found.", success: false });
    }

    if (blog.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update.", success: false });
    }

    if (title) blog.title = title;
    if (content) blog.content = content;

    if (req.file) {
      // Upload new image to Cloudinary
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      blog.image = cloudResponse.secure_url;
    }

    await blog.save();

    // Invalidate the blog cache
    await redisClient.del("blogs");
    await redisClient.del(`blog:${blogId}`);

    return res
      .status(200)
      .json({ message: "Blog updated successfully.", blog, success: true });
  } catch (error) {
    console.error("Error updating blog:", error);
    return res
      .status(500)
      .json({ message: "Failed to update blog.", success: false });
  }
};

// Delete Blog Post (with Redis invalidation)
export const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.query;
    const userId = req.id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res
        .status(404)
        .json({ message: "Blog not found.", success: false });
    }

    if (blog.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete.", success: false });
    }

    await Blog.findByIdAndDelete(blogId);

    // Invalidate the blog cache
    await redisClient.del("blogs");
    await redisClient.del(`blog:${blogId}`);

    return res
      .status(200)
      .json({ message: "Blog deleted successfully.", success: true });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete blog.", success: false });
  }
};

export const getTopContributers = async (req, res) => {
    try {
      // Check if cached data exists
      const cachedContributors = await redisClient.get("topContributors");
      if (cachedContributors) {
        console.log("Serving from Redis Cache"); 
        return res.json({ success: true, topContributors: JSON.parse(cachedContributors) });
      }
  
      console.log("Fetching from Database...");
      const topContributors = await Blog.aggregate([
        {
          $group: {
            _id: "$author",
            postCount: { $sum: 1 },
            totalLikes: { $sum: { $size: "$liked_by" } },
          },
        },
        { $sort: { postCount: -1, totalLikes: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "author",
          },
        },
        { $unwind: "$author" },
        {
          $project: {
            _id: "$author._id",
            name: "$author.fullname",
            avatar: "$author.profilePicture",
            postCount: 1,
            totalLikes: 1,
          },
        },
      ]);
  
      // Store result in Redis for 10 minutes (600 seconds)
      await redisClient.set("topContributors", JSON.stringify(topContributors), "EX", 600);
  
      res.json({ success: true, topContributors });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to fetch top contributors" });
    }
  }
