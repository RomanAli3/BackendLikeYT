import {User} from '../models/user.model.js'
import { UploadOnCloudinary } from '../utils/cloudnairy.js'
import { ApiError } from '../utils/apiErrorHandling.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { AsyncHandler } from '../utils/asyncHandler.js'

const options={
      httpOnly:true,
    secure:false
}
const genrateAccessAndRefreshToken=async (userId)=>{
    try {
        const user = await User.findById(userId)
        if (!user) {
    throw new ApiError(404, "User not found")
}
        const accessToken= user.genrateAccessToken()
        const refreshToken=user.genrateRefreshToken()
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})
           return {refreshToken,accessToken}
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong")
    }
}


const userRegisteration=AsyncHandler(async(req,res)=>{
    const {userName,email,password,fullName}=req.body
    if(!email.trim()||!password.trim()||!userName.trim()||!fullName.trim()){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser=await User.findOne({
        $or:[
            {email},
            {userName}
        ]
    })

    if(existedUser){
        throw new ApiError(400,"Usere Already Existed")
    }

    const profilePicLocalPath =req.files?.profilePicture?.[0].path 
    const coverImageLocalPath=req.files?.coverImage?.[0].path

    if(!profilePicLocalPath){
        throw new ApiError(400,"Profile picture is required")
    }

    const profilePic= await UploadOnCloudinary(profilePicLocalPath)
const coverImage = coverImageLocalPath
    ? await UploadOnCloudinary(coverImageLocalPath)
    : null

    if(!profilePic){
        throw new ApiError(400,"Error while uploading images")
    }

    const user=await User.create({
        userName,
        email,
        password,
        fullName,
        profilePicture:profilePic.url,
        coverImage:coverImage.url||""
    })

    const createdUser=await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(400, "error while registering user")

    }

    return res.status(201)
    .json(new ApiResponse(201,createdUser,"User created successfully"))
})


const loginUser=AsyncHandler(async(req,res)=>{
    const {userName,email,password}=req.body
    if(!(email||userName)){
        throw new ApiError(400,"email or username required for login")
    }
    if(!password){
        throw new ApiError(400,"Please enter password")
    }

    const existedUser=await User.findOne({
        $or:[
            {email},
            {userName}
        ]
    })

    if(!existedUser){
        throw new ApiError(401,"User not found")
    }

    const checkPassword=await existedUser.isPasswordCorrect(password)

    if(!checkPassword){
        throw new ApiError(400,"Invalid password! enter valid password")
    }

    const {refreshToken,accessToken}= await genrateAccessAndRefreshToken(existedUser._id)
    const loginUser=await User.findById(existedUser._id).select("-password -refreshToken")

    if(!loginUser){
        throw new ApiError(400,"User does not login ! please try again")
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    . json(new ApiResponse(200,
         {
        user: loginUser,
        accessToken,
        refreshToken
      },
        "user login successfully"))
})

const logoutUser=AsyncHandler(async(req,res)=>{
    
})







export {userRegisteration,loginUser}