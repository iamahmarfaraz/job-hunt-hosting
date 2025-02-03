import express from "express";
import {isAuthenticated, isRecruiter, isStudent} from "../middlewares/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";
 
const router = express.Router();

router.get("/apply/:id", isAuthenticated, isStudent, applyJob);
router.get("/get",isAuthenticated, isStudent, getAppliedJobs);
router.get("/:id/applicants", isAuthenticated, isRecruiter, getApplicants);
router.post("/status/:id/update", isAuthenticated, isRecruiter, updateStatus);
 

export default router;
