import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { Company } from "../models/company.model.js";
import { Blog } from "../models/blog.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../config/cloudinary.js";
import { mailSender } from "../utils/mailSender.js";
import { registrationSuccessTemplate } from "../mail/singupTemp.js";
import redisClient from "../config/redis.js"; // Import Redis
import dotenv from "dotenv";
dotenv.config();

// User Registration
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email.",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse?.secure_url || `https://api.dicebear.com/5.x/initials/svg?seed=${fullname}`
            }
        });

        // Send email notification
        await mailSender(email, "Welcome to JobHunt!", registrationSuccessTemplate(fullname));

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log("Error in SIGNUP :- ", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while registering user"
        });
    }
};

// User Login
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        // Check if user exists in Redis
        let user = await redisClient.get(`user:${email.toLowerCase()}`);
        if (!user) {
            user = await User.findOne({ email: { $regex: `^${email}$`, $options: "i" } });
            if (!user) {
                return res.status(400).json({ message: "Incorrect email.", success: false });
            }
            await redisClient.set(`user:${email.toLowerCase()}`, JSON.stringify(user), "EX", 3600);
        } else {
            user = JSON.parse(user);
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect password.", success: false });
        }

        if (role !== user.role) {
            return res.status(400).json({ message: "Account doesn't exist with current role.", success: false });
        }

        const payload = { userId: user._id, userRole: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        const options = { expires: new Date(Date.now() + 86400000), httpOnly: true, sameSite: "strict" };

        return res.status(200).cookie("token", token, options).json({
            token,
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        });
    } catch (error) {
        console.log("Error in LOGIN :- ", error);
        return res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};

// Logout User
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

// Update Profile
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }

        const userId = req.id;
        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found.", success: false });
        }

        // Updating data
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = file.originalname;
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        // Update Redis cache
        await redisClient.set(`user:${email.toLowerCase()}`, JSON.stringify(user), "EX", 3600);


        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log("Error in UPDATE PROFILE :- ", error);
        return res.status(500).json({
            success: false,
            message: "Profile update failed"
        });
    }
};

// Update Profile Pic
export const updateProfilePic = async (req, res) => {
    try {
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const userId = req.id;
        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found.", success: false });
        }

        if (cloudResponse) {
            user.profile.profilePhoto = cloudResponse.secure_url;
        }

        await user.save();

        

        // Update Redis cache
        await redisClient.set(`user:${user?.email.toLowerCase()}`, JSON.stringify(user), "EX", 3600);

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log("Error in UPDATE PROFILE :- ", error);
        return res.status(500).json({
            success: false,
            message: "Profile update failed"
        });
    }
};


// Delete Account Controller
export const deleteAccount = async (req, res) => {
    try {
        const userId = req.id;

        // Fetch user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // If user is a recruiter, delete the company they created (if any)
        if (user.role === "recruiter") {
            await Company.deleteMany({ userId: userId });

            // Delete all jobs posted by this recruiter
            await Job.deleteMany({ created_by: userId });
        }

        // Delete all applications submitted by this user
        await Application.deleteMany({ applicant: userId });

        // Delete all blogs posted by this user
        await Blog.deleteMany({ author: userId });

        // Remove this user’s likes from all blogs
        await Blog.updateMany(
            { liked_by: userId },
            { $pull: { liked_by: userId } }
        );

        // Delete user from the database
        await User.findByIdAndDelete(userId);

        // Remove user from Redis cache
        await redisClient.del(`user:${user.email.toLowerCase()}`);

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully along with all associated data.",
        });

    } catch (error) {
        console.error("Error in DELETE ACCOUNT :- ", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while deleting account.",
        });
    }
};
