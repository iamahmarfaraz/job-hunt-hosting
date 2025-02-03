import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export const connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {})
    .then(() => console.log("DB CONNECTION SUCCESSFUL"))
    .catch((error) => {
        console.log("DB CONNECTION FAILED");
        console.error(error);
        process.exit(1); 
    });
};
