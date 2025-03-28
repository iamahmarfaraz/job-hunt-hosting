//old style
// const express = require("express");
// const app = express();

// New Style
import cookieParser from "cookie-parser";
import express from "express";
import fileUpload from 'express-fileupload';
import path from "path";

import dotenv from 'dotenv';
dotenv.config();


const app = express();
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
import cors from "cors";
// const database = require("./config/database");
import { connect } from './config/database.js';
connect();


// middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(
    cors({
        origin:"https://job-hunt-hosting.onrender.com",
        credentials:true, 
    })
);

const __dirname = path.resolve();

// app.use(
//     fileUpload({
//         useTempFiles:true,
//         tempFileDir:"/tmp",
//     })
// )


import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import blogRoute from "./routes/blog.route.js"


// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/blog",blogRoute)

app.use(express.static(path.join(__dirname, "/src/dist")));
app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname, "src", "dist", "index.html"));
})


// database.connect();

const PORT = process.env.PORT || 7000;
app.listen(PORT , ()=>{
    console.log(`App is running at PORT : ${PORT}`)
})
