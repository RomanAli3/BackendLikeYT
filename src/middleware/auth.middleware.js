import {User} from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { AsyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiErrorHandling.js'

dotenv.config({
    path:"./.env"
})
const verifyJwt=AsyncHandler(async (req,res,next)=>{
    const token=req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ", "")

    if(!token){
        throw new ApiError(401,"unAuthorized user")
    }

    const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_KEY)

    const user = await User.findById(decodedToken._id).select("-password -refreshToken")

    if(!user){
        throw new ApiError(400,"Invalid token")
    }

    req.user=user  
    next()
})

export {verifyJwt} 