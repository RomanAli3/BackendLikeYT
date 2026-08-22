import mongoose from "mongoose"


const mongoDbConnection=()=>{
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>console.log('Connection Established !'))
    .catch((error)=>console.log('Connection Error :',error))
}

export {mongoDbConnection}