import express from "express";
import {isAuthenticated, isRecruiter} from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, updateJob } from "../controllers/job.controller.js";

const router = express.Router();

router.post("/post", isAuthenticated, isRecruiter, postJob);
router.get("/get", getAllJobs);
router.get("/getadminjobs", isAuthenticated, isRecruiter, getAdminJobs);
router.get("/get/:id", isAuthenticated, getJobById);
router.put("/update-job/:id",isAuthenticated,isRecruiter,updateJob);

export default router;
