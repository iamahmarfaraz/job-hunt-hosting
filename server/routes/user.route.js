import express from "express";
const router = express.Router();

import { deleteAccount, login, logout, register, updateProfile, updateProfilePic } from "../controllers/user.controller.js";
import {isAuthenticated} from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";


router.post("/register",singleUpload,register);
// router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/profile/update", isAuthenticated,singleUpload,updateProfile);
router.post("/profile/updatepfp",isAuthenticated,singleUpload,updateProfilePic);
router.delete("/delete-account",isAuthenticated,deleteAccount)
// router.post("/profile/update", isAuthenticated,updateProfile);

export default router;
