import mongoose from "mongoose"

const videoSchema=mongoose.Schema({
    title:{
        type:String,
        required:[true,'title is required'],
        minlength:4,
        maxlength:120
    },
    description:{
        type:String,
        maxlength:300
    },
    video:{
        type:String,
        required:[true,'video is required'],
    },
    views:{
        type:Number,
        default:0
    },
     thumbnailUrl: {
    type: String,
    required: [true, 'Thumbnail URL is required']
  },
  duration: {
    type: Number, 
    required: true,
    min: [0, 'Duration cannot be negative']
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  }
},{timestamps:true})

export const Video = mongoose.model('Video',videoSchema)

