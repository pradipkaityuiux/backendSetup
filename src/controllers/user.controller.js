import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiRespons.js";

export const registerUser = asyncHandler(async(req, res)=>{
    const {userName, fullName, email, password} = req.body;
    if([userName, fullName, email, password].some(field => field?.trim === "")){
        throw new ApiError(400, "All fields are required.")
    }
    const existingUser = User.findOne({
        $or: [{ userName },{ email }]  // This checks if username or email is present or not in database
    })
    if(existingUser){
        throw new ApiError(409, "User with username or email already exists")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path   // Getting the local path of the avatar.
    const coverImageLocalPath = req.files?.coverImage[0]?.path   // Getting the local path of the cover image.

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) throw new ApiError(400, "Avatar file is required");

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase(),
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser) {
        throw new ApiError(501, "Something went wrong while registering user")
    }
    
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )




    // res.status(200).json({
    //     message: "ok"
    // })
})