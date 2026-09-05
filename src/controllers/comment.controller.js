import { Comment } from "../models/comment.model.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrorHandling.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {Video} from '../models/video.model.js'
const addComment=AsyncHandler(async(req,res)=>{
    const {videoId} =req.params

    const {content} = req.body

    if(!content?.trim()){
        throw new ApiError(400,"please enter comment")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(400,"Video not found")
    }

    const comment =await Comment.create({
        video:videoId,
        content,
        user:req.user._id
    })


    return res.status(201)
    .json(new ApiResponse(201,comment,"Comment uploaded successfully"))
})


const deleteComment=AsyncHandler(async(req,res)=>{
    const {commentId}=req.params

    const comment =await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(400,"comment not found")
    }

    if(comment.user.toString()==req.user._id.toString()){
        await Comment.findByIdAndDelete(commentId)
    }
    else{
        throw new ApiError(400,"you cannot delete this comment")
    }

    return res.status(200)
    .json(new ApiResponse(200,{},"Comment deleted successfully"))
})

const getAllComments =AsyncHandler(async(req,res)=>{
    const allComments =await Comment.find({})
     
    return res.status(200)
    .json(new ApiResponse(200,allComments,"All comments fetched succussfully"))
})

const getVideoComments=AsyncHandler(async(req,res)=>{
    const {videoId}=req.params

    const video =await Video.findById(videoId)
    if(!video){
        throw new ApiError(400,"Video not found")
    }

    const comments=await Comment.find({video:videoId}).populate('user')

    if(!comments){
        throw new ApiError(400,"Comments not founds")
    }

    return res.status(200)
    .json(new ApiResponse(200,comments,"Video comments fetched successfully"))
})
export {
    addComment,
    deleteComment,
    getAllComments,
    getVideoComments
}