import express from "express";
const router = express.Router();

import { login, logout, register, updateProfile, testPFP } from "../controllers/user.controller.js";
import {isAuthenticated} from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";



router.post("/testingpfp", (req, res, next) => {
    console.log("Headers:", req.headers);
    console.log("Body (raw):", req.body);
    next();
},singleUpload,testPFP);
router.post("/register",singleUpload,register);
// router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/profile/update", isAuthenticated,singleUpload,updateProfile);
// router.post("/profile/update", isAuthenticated,updateProfile);

export default router;
