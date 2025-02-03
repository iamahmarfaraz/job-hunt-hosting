import express from "express";
import {isAuthenticated, isRecruiter} from "../middlewares/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.post("/register", isAuthenticated, isRecruiter, registerCompany);
router.get("/get", isAuthenticated, isRecruiter, getCompany);
router.get("/get/:id", isAuthenticated,getCompanyById);
router.put("/update/:id", isAuthenticated, isRecruiter, singleUpload, updateCompany);

export default router;
