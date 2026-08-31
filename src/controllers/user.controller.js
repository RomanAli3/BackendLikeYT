import {User} from '../models/user.model.js'
import { UploadOnCloudinary } from '../utils/cloudnairy.js'
import { ApiError } from '../utils/apiErrorHandling.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { AsyncHandler } from '../utils/asyncHandler.js'
import nodemailer from "nodemailer"

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


// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendemail(to, sub, msg) {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to,
        subject: sub,
        html: msg
    });
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
        throw new ApiError(400,"Error while uploading images please change time setting")
    }

    const user=await User.create({
        userName,
        email,
        password,
        fullName,
        profilePicture:profilePic.url,
        coverImage:coverImage?.url||""
    })

    const createdUser=await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(400, "error while registering user")

    }

   await sendemail(
    email,
    "Welcome to VideoHub — Your Account Has Been Created! 🎉",
    `
        <h2>Welcome to VideoHub, ${userName}! 🎉</h2>

        <p>Your account has been successfully created.</p>

        <p>You can now explore VideoHub and enjoy everything our platform has to offer.</p>

        <p>Thanks for joining us!</p>

        <p>— The VideoHub Team 🚀</p>
    `
)
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

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{refreshToken:1}
        },
        {
            new:true
        }
    )
    return res.status(200)
    .clearCookie("accessToekn",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user logout successfully"))
})




const getCurrentUser=AsyncHandler(async(req,res)=>{
    const user =req.user
    if(!user){
        throw new ApiError("User not loged in")
    }

    return res.status(200)
    .json(new ApiResponse(200,user,"User fetched sucsessfuly fetched"))

})

const changeProfilePicture=AsyncHandler(async(req,res)=>{
    const profilePictureLocalPath=req.files?.profilePicture?.[0].path
    if(!profilePictureLocalPath){
        throw new ApiError(400,"Please select profile picture")
    }

    const profilePicture=await UploadOnCloudinary(profilePictureLocalPath)

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            profilePicture:profilePicture.url
        },
        {
            new:true
        }
    )

    return res.status(200)
    .json(new ApiResponse(200,user,"User profile picture updated"))

})

const changeCoverImage=AsyncHandler(async(req,res)=>{
    const coverImageLocalPath=req.files?.coverImage?.[0].path
    if(!coverImageLocalPath){
        throw new ApiError(400,"Please select cover image ")
    }

    const coverImage=await UploadOnCloudinary(coverImageLocalPath)

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            coverImage:coverImage.url
        },
        {
            new:true
        }
    )

    return res.status(200)
    .json(new ApiResponse(200,user,"User profile picture updated"))

})

const changeUserPassword=AsyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body
    if(!oldPassword.trim()||!newPassword.trim()){
        throw new ApiError(400,"Enter old and new password" )
    }

    const user = await User.findById(req.user._id)
    const checkPassword = await user.isPasswordCorrect(oldPassword)

    if(!checkPassword){
        throw new ApiError(400,"Invalid password !")
    }

    const updatedUser=await User.findByIdAndUpdate(
        req.user._id,
    {
        password:newPassword
    },
    {
        new:true
    }
    )

    return res.status(200)
    .json(new ApiResponse(200,updatedUser,"Password change successfully"))


})
const changeFullName=AsyncHandler(async(req,res)=>{
    const {fullName} = req.body
    if(!fullName){
        throw new ApiError(400,"Name is required")
    }
    const user=await User.findByIdAndUpdate(
        req.user._id,
        {
            fullName:fullName
        },
        {
            new:true
        }
    ).select("-password -refreshToken")

    return res.status(200)
    .json(new ApiResponse(200,user,"fullName changed successfully"))
})

export {
    userRegisteration,
    loginUser,
    logoutUser,
    getCurrentUser,
    changeProfilePicture,
    changeCoverImage,
    changeUserPassword,
    changeFullName
}