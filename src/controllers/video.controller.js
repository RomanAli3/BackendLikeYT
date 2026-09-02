import {AsyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiErrorHandling.js'
import { ApiResponse } from '../utils/apiResponse.js'
import {Video } from '../models/video.model.js'
import { UploadOnCloudinary } from '../utils/cloudnairy.js'


const addVideo =AsyncHandler(async(req,res)=>{
    const {title,description,views,duration}=req.body
   if (!title?.trim() || !description?.trim()) {
    throw new ApiError(400, "Title and description are required")
}
    const videolocalPath=req.files?.video?.[0].path
    const thumbnailUrlLocalPath=req.files?.thumbnailUrl?.[0].path
    if(!videolocalPath){
        throw new ApiError(400,"please select video")
    }
    const video = await UploadOnCloudinary(videolocalPath)
    const thumbnailUrl=thumbnailUrlLocalPath?  await UploadOnCloudinary(thumbnailUrlLocalPath):null


    if(!video){
        throw new ApiError(500,"Error while uploading! Please set clock time")
    }

    if(!thumbnailUrl){
        throw new ApiError(500,"Error while uploading! Please set clock time")
    }


    const videoData=await Video.create({
        title,
        description,
        thumbnailUrl:thumbnailUrl.url,
        video:video.url,
        views,
        owner:req.user._id,
        duration

    })

    return res.status(201)
    .json(new ApiResponse(201,videoData,"Video uploaded successfully!"))
})

const deleteVideo=AsyncHandler(async(req,res)=>{
    const {id}=req.params
   
    const video=await Video.findById(id)
    

if (!video) {
    throw new ApiError(404, "Video not found")
}

if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "Only owner can delete video")
}
    
  
   await Video.findByIdAndDelete(id)

  return res.status(200)
  .json(new ApiResponse(200,{},"Video deleted successfully"))
})

const getAllVideo=AsyncHandler(async(req,res)=>{
    const videos=await Video.find({})

    return res.status(200)
    .json(new ApiResponse(200,videos,"All video fetched successfully"))
})

const getUserVideo = AsyncHandler(async (req, res) => {

    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(400, "Please login first");
    }

    const videos = await Video.find({
        owner: userId
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                videos,
                "User videos fetched successfully"
            )
        );
});
export {addVideo,deleteVideo,getAllVideo,getUserVideo}