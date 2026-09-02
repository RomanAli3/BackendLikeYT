import mongoose from "mongoose";

const likeSchema=mongoose.Schema({
    like:{
        type:Boolean,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    video:{
         type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }
},{timestamps:true})


export const Like=mongoose.model("Like",likeSchema)