import multer from "multer";

const storage = multer.memoryStorage(); // Store file in memory for processing
export const singleUpload = multer({
    storage,
    // limits: { fileSize: 5 * 1024 * 1024 }, // Optional: Limit file size to 5MB
}).single("file"); // Ensure the field name is "file"
