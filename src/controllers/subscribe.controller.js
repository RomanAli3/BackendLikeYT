import { Subscribe } from "../models/subscribe.model.js";
import {User} from '../models/user.model.js'
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrorHandling.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";


const subscribeOrUnsubscribe=AsyncHandler(async(req,res)=>{
    const {channelId}=req.params

    const userChannel =await User.findById(channelId).select("-password -refreshToken")

    if(!userChannel){
        throw new ApiError(400,"channel not found try again later !")
    }

    const alreadySubscribed =await Subscribe.findOne({
        channel:channelId,
        user:req.user._id
    }
    )

    if(alreadySubscribed){
       const unsubscribe= await Subscribe.findByIdAndDelete(alreadySubscribed._id)

        return res.status(200)
        .json(new ApiResponse(200,unsubscribe,"Channel unSubscribed successfully"))
    }

    const subscribe =await Subscribe.create({
        channel:channelId,
        user:req.user._id,
        isSubscribed:true
    })


    return res.status(201)
    .json(new ApiResponse(201,subscribe,"Channel subscribed successfully"))
    
})

const getChannelSubscribed=AsyncHandler(async(req,res)=>{
    const {channelId} =req.params

    const userChannel=await User.findById(channelId)
    if(!userChannel){
        throw new ApiResponse(400,"Channel not found")
    }

    const channelIdObject=mongoose.Types.ObjectId.createFromHexString(channelId)

    const subscriber= await Subscribe.aggregate([
        {
            $match:{channel:channelIdObject}
        },
        {
            $count:"subscriber"
        }
    ])

    return res.status(200)
    .json(new ApiResponse(200,subscriber,"Subscriber fetched successfully"))
})
export {subscribeOrUnsubscribe,getChannelSubscribed}