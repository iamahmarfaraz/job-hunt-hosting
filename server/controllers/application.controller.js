import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import {User} from "../models/user.model.js"
import redisClient from "../config/redis.js"; // Import Redis client

// Apply for a Job
export const applyJob = async (req, res) => {
    try {
      const userId = req.id;
      const jobId = req.params.id;
  
      if (!jobId) {
        return res.status(400).json({
          message: "Job id is required.",
          success: false,
        });
      }
  
      // Check if the user has already applied
      const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
      if (existingApplication) {
        return res.status(400).json({
          message: "You have already applied for this job",
          success: false,
        });
      }
  
      // Check if the job exists
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({
          message: "Job not found",
          success: false,
        });
      }
  
      // Create a new application
      const newApplication = await Application.create({
        job: jobId,
        applicant: userId,
      });
  
      job.applications.push(newApplication._id);
      await job.save();
  
      // Invalidate Redis Cache for this job so that fresh data will be fetched next time
      await redisClient.del(`job:${jobId}`);
      // Also clear cached applied jobs for the user, if you have such caching
      await redisClient.del(`appliedJobs:${userId}`);
  
      return res.status(201).json({
        message: "Job applied successfully.",
        success: true,
      });
    } catch (error) {
      console.log("ERROR WHILE APPLYING JOB :- ", error);
      return res.status(500).json({
        success: false,
        message: "Job Application Failed",
      });
    }
  };

// Get all Applied Jobs
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;

        // Check Redis Cache
        const cachedApplications = await redisClient.get(`appliedJobs:${userId}`);
        if (cachedApplications) {
            return res.status(200).json({
                application: JSON.parse(cachedApplications),
                success: true
            });
        }

        // Fetch applications from DB
        const application = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'job',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'company',
                    options: { sort: { createdAt: -1 } },
                }
            });

        // if (!application.length) {
        //     return res.status(404).json({
        //         message: "No Applications",
        //         success: false
        //     });
        // }

        // Store in Redis Cache (Expire in 10 minutes)
        await redisClient.setex(`appliedJobs:${userId}`, 600, JSON.stringify(application));

        return res.status(200).json({
            application,
            success: true
        });
    } catch (error) {
        console.log("ERROR WHILE FETCHING APPLIED JOB :- ", error);
        return res.status(500).json({
            success: false,
            message: "Fetching Applied Job Failed"
        });
    }
};

// Get Job Applicants (For Admin)
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;

        // Check Redis Cache
        const cachedApplicants = await redisClient.get(`jobApplicants:${jobId}`);
        if (cachedApplicants) {
            return res.status(200).json({
                job: JSON.parse(cachedApplicants),
                success: true
            });
        }

        // Fetch job and populate applications
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant'
            }
        });

        if (!job) {
            return res.status(404).json({
                message: 'Job not found.',
                success: false
            });
        }

        // Store in Redis Cache (Expire in 10 minutes)
        await redisClient.setex(`jobApplicants:${jobId}`, 600, JSON.stringify(job));

        return res.status(200).json({
            job,
            success: true
        });
    } catch (error) {
        console.log("ERROR WHILE GETTING APPLICANTS :- ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get Applicants"
        });
    }
};

// Update Job Application Status
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({
                message: 'Status is required',
                success: false
            });
        }

        // Find the application
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        // Update status
        application.status = status.toLowerCase();
        await application.save();

        // Invalidate Cache for Applied Jobs
        await redisClient.del(`appliedJobs:${application.applicant}`);

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true
        });

    } catch (error) {
        console.log("ERROR WHILE UPDATING JOB STATUS :- ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to Update Job Status"
        });
    }
};
