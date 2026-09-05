import {Like} from "../models/like.model.js"
import { AsyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiErrorHandling.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { Video } from "../models/video.model.js"
import mongoose from 'mongoose'
const likeVideo = AsyncHandler(async (req, res) => {

    const { videoId } = req.params

    const userId = req.user._id

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const alreadyLiked = await Like.findOne({
        user: userId,
        video: videoId
    })

    if (alreadyLiked) {
        await Like.findByIdAndDelete(alreadyLiked._id)

        return res.status(200)
        .json(new ApiResponse(200, {}, "Video unliked"))
    }

    const like = await Like.create({
        user: userId,
        video: videoId,
        like: true
    })

    return res.status(201)
    .json(new ApiResponse(201, like, "Video liked successfully"))
})

const getAllLike=AsyncHandler(async(req,res)=>{
    const allLikes= await Like.find({})
     return res.status(200)
     .json(new ApiResponse(200,allLikes,"all likes fetched successfully"))
})

const getLikeOnVideo=AsyncHandler(async(req,res)=>{
    const {videoId}=req.params

    const video=await Video.findById(videoId)

    if(!video){
        throw new ApiError(400,"Video not found")
    }
    const videoObjectId = mongoose.Types.ObjectId.createFromHexString(videoId);

    const like = await Like.aggregate([
        { $match: { video: videoObjectId } },
  { $count: "like" }
    ])

   

    return res.status(200)
    .json(new ApiResponse(200,like,"like fetched successfully"))
})

export {likeVideo,getAllLike,getLikeOnVideo}