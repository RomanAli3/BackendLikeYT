import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema=mongoose.Schema({
    userName:{
        type:String,
        required:[true,'username is required'],
        unique:[true,'username already existed'],
        lowercase:true
    },
    email:{
        type:String,
        required:[true,'email is required'],
        unique:[true,'email already existed'],
        lowercase:true,
         match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    fullName:{
        type:String,
        required:[true,'fullName is required']
    },
    profilePicture:{
        type:String,
        required:[true,'Profile picture required']
    },
    password:{
        type:String,
        required:[true,'password is required'],
        minlength:6,
    },
    coverImage:{
        type:String,
    },
    refrehToken:{
        type:String
    }
},{timestamps:true})

userSchema.pre("save", async function (){
    if(!this.isModified('password')) return
    const hashPassword=await bcrypt.hash(this.password,10)
    this.password=hashPassword
})

userSchema.methods.isPasswordCorrect=async function(password) {
   return await bcrypt.compare(password,this.password)
}

userSchema.methods.genrateAccessToken=async function(){

    return jwt.sign({
        _id:this._id,
        email:this.email,
        userName:this.userName,
    },
     process.env.ACCESS_TOKEN_KEY ,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

userSchema.methods.genrateRefreshToken=async function(){

    return jwt.sign({
        _id:this._id,
    },
     process.env.REFRESH_TOKEN_KEY ,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User =mongoose.model('User',userSchema)