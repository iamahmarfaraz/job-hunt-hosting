import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../config/cloudinary.js";
import uploadImageToCloudinary from "../utils/imageUploader.js";
import { registrationSuccessTemplate } from "../mail/singupTemp.js";
import { mailSender } from "../utils/mailSender.js";
import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        // const file = req.file;
        // // if (!file) {
        // //     return res.status(400).json({
        // //         message: "File not uploaded",
        // //         success: false,
        // //     });
        // // }

        // const cloudResponse = "";
        // if (file) {
        //     const fileUri = getDataUri(file);
        //     cloudResponse = await uploadImageToCloudinary(
        //         fileUri.content,
        //         process.env.FOLDER_NAME,
        //         1000,
        //         1000
        //     );
        // }

        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse?.secure_url 
                    ? cloudResponse.secure_url 
                    : `https://api.dicebear.com/5.x/initials/svg?seed=${fullname}`,
            },
        });

        // Send notification email

		const emailResponse = await mailSender(
			email,
            "Welcome to JobHunt - Your Registration Was Successful!",
			registrationSuccessTemplate(fullname),
        );

		console.log("Email sent successfully:", emailResponse.response);
        console.log("Connected to DB:", mongoose.connection.name);
		

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log("Error in SIGNUP :- ",error);
        return res.status(400).json({
            success: false,
            message: "Error occurred while sending email",
            error: error.message,
        });
    }
}

export const testPFP = async (req, res) => {
    try {
        const file = req.file;
        console.log("FILE :- ",file);
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded!",
            });
        }

        console.log("File received:", file);
        const fileUri = getDataUri(file);

        // const cloudResponse = await uploadImageToCloudinary(
        //     fileUri.content,
        //     process.env.FOLDER_NAME,
        //     1000,
        //     1000
        // );
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        console.log("Cloudinary Response:", cloudResponse);
        console.log("SECURE URL :- ",cloudResponse.secure_url);

        return res.status(200).json({
            success: true,
            message: "File uploaded successfully!",
            url : cloudResponse?.secure_url
        });
    } catch (error) {
        console.error("Error while uploading PFP:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while uploading PFP",
            error: error.message,
        });
    }
};



export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        // Use a case-insensitive query to find the user
        let user = await User.findOne({ email: { $regex: `^${email}$`, $options: "i" } }).populate("profile");

        if (!user) {
            return res.status(400).json({
                message: "Incorrect email.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const payload = {
            userId: user._id,
            userRole : user.role
        }
        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        // create cookie & return response
        const options ={
            expires:new Date(Date.now() + 1*24*60*60*1000),
            httpOnly:true,
            sameSite: 'strict'
        }
        return res.status(200).cookie("token", token, options).json({
            token, 
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        
        const file = req.file;
        // cloudinary ayega idhar
        const fileUri = getDataUri(file);
        const cloudResponse = await await cloudinary.uploader.upload(fileUri.content);



        let skillsArray;
        if(skills){
            skillsArray = skills.split(",");
        }
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        // updating data
        if(fullname) user.fullname = fullname
        if(email) user.email = email
        if(phoneNumber)  user.phoneNumber = phoneNumber
        if(bio) user.profile.bio = bio
        if(skills) user.profile.skills = skillsArray
      
        // resume comes later here...
        if(cloudResponse){
            user.profile.resume = cloudResponse.secure_url // save the cloudinary url
            user.profile.resumeOriginalName = file.originalname // Save the original file name
        }


        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message:"Profile updated successfully.",
            user,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}