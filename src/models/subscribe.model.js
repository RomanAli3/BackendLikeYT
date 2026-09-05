import mongoose from "mongoose";

const subscribeSchema = mongoose.Schema({
    isSubscribed:{
        type:Boolean,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    channel:{
            type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})



export const Subscribe =mongoose.model("Subscribe",subscribeSchema)