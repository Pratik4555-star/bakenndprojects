import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log("No file provided");
            return null; // No file to upload
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // Automatically determine the resource type (image, video, etc.)
        });

        // file has been uploaded
        console.log("File successfully uploaded to Cloudinary:", response.url);
        return response; // Return the entire response object (contains the URL and other info)

    } catch (error) {
        console.error("Error uploading to Cloudinary:", error.message);
        
        // Cleanup the local file after upload failure
        try {
            await fs.promises.unlink(localFilePath); // Use promises for async unlink
            console.log("Temporary file deleted.");
        } catch (err) {
            console.error("Error deleting temporary file:", err.message);
        }

        return null; // Return null if upload failed
    }
};

export { uploadCloudinary };
