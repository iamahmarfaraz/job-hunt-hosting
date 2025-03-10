import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../config/cloudinary.js";
import redisClient from "../config/redis.js";

// Register a new company
export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required.",
        success: false,
      });
    }

    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({
        message: "You can't register the same company.",
        success: false,
      });
    }

    company = await Company.create({
      name: companyName,
      userId: req.id,
    });

    // Invalidate cached companies for this recruiter
    await redisClient.del(`companies:${req.id}`);

    return res.status(201).json({
      message: "Company registered successfully.",
      company,
      success: true,
    });
  } catch (error) {
    console.log("ERROR WHILE REGISTERING THE COMPANY :- ", error);
    return res.status(500).json({
      success: false,
      message: "Company not registered",
    });
  }
};

// Get all companies for a recruiter (Cached)
export const getCompany = async (req, res) => {
  try {
    const userId = req.id;

    // Check if data exists in Redis cache
    const cachedCompanies = await redisClient.get(`companies:${userId}`);
    if (cachedCompanies) {
      return res.status(200).json({
        companies: JSON.parse(cachedCompanies),
        success: true,
      });
    }

    const companies = await Company.find({ userId });

    if (!companies || companies.length === 0) {
      return res.status(404).json({
        message: "Companies not found.",
        success: false,
      });
    }

    // Store response in Redis for future requests
    await redisClient.set(
      `companies:${userId}`,
      JSON.stringify(companies),
      "EX",
      3600
    ); // Cache for 1 hour

    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.log("ERROR WHILE GETTING COMPANY", error);
    return res.status(500).json({
      success: false,
      message: "Company not found",
    });
  }
};

// Get company by ID (Cached)
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;

    // Check Redis cache
    const cachedCompany = await redisClient.get(`company:${companyId}`);
    if (cachedCompany) {
      return res.status(200).json({
        company: JSON.parse(cachedCompany),
        success: true,
      });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    // Store in Redis cache for future requests
    await redisClient.set(
      `company:${companyId}`,
      JSON.stringify(company),
      "EX",
      3600
    ); // Cache for 1 hour

    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.log("ERROR WHILE FINDING COMPANY ID :- ", error);
    return res.status(500).json({
      success: false,
      message: "Company not found by ID",
    });
  }
};

// Update company information (Invalidate cache)
export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;

    const file = req.file;
    let logo = null;

    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      logo = cloudResponse.secure_url;
    }

    const updateData = { name, description, website, location };
    if (logo) updateData.logo = logo;

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    // Invalidate the cache for this company and recruiter
    await redisClient.del(`company:${req.params.id}`);
    await redisClient.del(`companies:${company.userId}`);

    return res.status(200).json({
      message: "Company information updated.",
      success: true,
      company,
    });
  } catch (error) {
    console.log("ERROR WHILE UPDATING COMPANY", error);
    return res.status(500).json({
      success: false,
      message: "Company not updated",
    });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Check if company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    // Find all jobs posted by the company
    const jobs = await Job.find({ company: companyId });

    // Extract job IDs
    const jobIds = jobs.map((job) => job._id);

    // Delete all applications related to those jobs
    await Application.deleteMany({ job: { $in: jobIds } });

    // Delete all jobs related to the company
    await Job.deleteMany({ company: companyId });

    // Delete the company itself
    await Company.findByIdAndDelete(companyId);

    // Clear Redis Cache
    await redisClient.del(`company:${companyId}`); // Remove company cache
    await Promise.all(jobIds.map((jobId) => redisClient.del(`job:${jobId}`))); // Remove job caches

     // Fetch updated companies list
     const updatedCompanies = await Company.find();

    res
      .status(200)
      .json({
        success: true,
        message: "Company and all related data deleted successfully",
        companies : updatedCompanies,
      });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
