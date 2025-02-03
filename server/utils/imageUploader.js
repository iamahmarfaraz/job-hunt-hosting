import cloudinary from "../config/cloudinary.js";

const uploadImageToCloudinary = async (fileBuffer, folder, height, quality) => {
    return new Promise((resolve, reject) => {
        const options = { folder, resource_type: "auto" };

        if (height) {
            options.height = height;
        }
        if (quality) {
            options.quality = quality;
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if (error) {
                    return reject(new Error("Image upload to Cloudinary failed"));
                }
                resolve(result);
            }
        );

        uploadStream.end(fileBuffer);
    });
};

export default uploadImageToCloudinary;
