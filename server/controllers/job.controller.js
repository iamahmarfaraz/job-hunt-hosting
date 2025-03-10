import { Job } from "../models/job.model.js";
import redisClient from "../config/redis.js";

// Admin posts a new job
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });

    // Invalidate job listings cache
    await redisClient.del("jobs");
    await redisClient.del(`adminJobs:${userId}`);

    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.log("ERROR WHILE POSTING JOB :- ", error);
    return res.status(500).json({
      success: false,
      message: "Job Not Posted",
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = req.id;

    const jobId = req.params.id;


    const job = await Job.findById(jobId);

    if(title) job.title = title;
    if(description) job.description = description;
    if(requirements) job.requirements = requirements;
    if(salary) job.salary = salary;
    if(location) job.location = location;
    if(jobType) job.jobType = jobType;
    if(experience) job.experience = experience;
    if(position) job.position = position;
    if(companyId) job.company = companyId;

    await job.save();

    // Invalidate job listings cache
    await redisClient.del("jobs");
    await redisClient.del(`adminJobs:${userId}`);
    await redisClient.del(`job:${jobId}`);

    return res.status(201).json({
      message: "Job Updated successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.log("ERROR WHILE UPDATING JOB :- ", error);
    return res.status(500).json({
      success: false,
      message: "Job Not Updated",
    });
  }
};

// Get all jobs for students (Cached)
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    // Check Redis cache
    const cachedJobs = await redisClient.get("jobs");
    if (cachedJobs) {
      return res.status(200).json({
        jobs: JSON.parse(cachedJobs),
        success: true,
      });
    }

    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate({ path: "company" })
      .sort({ createdAt: -1 });

    if (!jobs.length) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }

    // Cache jobs in Redis
    await redisClient.set("jobs", JSON.stringify(jobs), "EX", 3600); // Cache for 1 hour

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log("ERROR WHILE FETCHING JOBS :- ", error);
    return res.status(500).json({
      success: false,
      message: "Job Not Fetched",
    });
  }
};

// Get job details by ID (Cached)
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Check Redis cache
    const cachedJob = await redisClient.get(`job:${jobId}`);
    if (cachedJob) {
      return res.status(200).json({
        job: JSON.parse(cachedJob),
        success: true,
        message:"Serving from Redis Client"
      });
    }

    const job = await Job.findById(jobId)
      .populate("applications")
      .populate({ path: "company", select: "name location logo" }); // Populate specific fields

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    // Cache job details
    await redisClient.set(`job:${jobId}`, JSON.stringify(job), "EX", 3600); // Cache for 1 hour

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.log("ERROR WHILE FETCHING JOB BY ID :- ", error);
    return res.status(500).json({
      success: false,
      message: "Job Not Fetched by ID",
    });
  }
};

// Get all jobs posted by an admin (Cached)
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    // Check Redis cache
    const cachedAdminJobs = await redisClient.get(`adminJobs:${adminId}`);
    if (cachedAdminJobs) {
      return res.status(200).json({
        jobs: JSON.parse(cachedAdminJobs),
        success: true,
        message: "Admin Job Fetched",
      });
    }

    const jobs = await Job.find({ created_by: adminId })
      .populate({ path: "company" })
      .sort({ createdAt: -1 });

    if (!jobs.length) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }

    // Cache admin's job postings
    await redisClient.set(
      `adminJobs:${adminId}`,
      JSON.stringify(jobs),
      "EX",
      3600
    ); // Cache for 1 hour

    return res.status(200).json({
      jobs,
      success: true,
      message: "Admin Job Fetched",
    });
  } catch (error) {
    console.log("ERROR WHILE FETCHING ADMIN'S JOB :- ", error);
    return res.status(500).json({
      success: false,
      message: "Admin Job Not Fetched",
    });
  }
};
