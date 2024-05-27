import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const uploadOnCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath) return null;
        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{ 
            resource_type: "auto"
        })
        // File has been uploaded successfully
        console.log(`File has been uploaded successfully: ${response.url}`)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // Remove file from local server
        return null;
    }
}