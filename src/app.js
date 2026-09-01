import express from 'express'
import cookieParser from 'cookie-parser'
const app = express()
import dotenv from 'dotenv'
dotenv.config({
    path:'./.env'
})
app.use(express.json())
app.use(cookieParser())

import userRouter from './routes/user.routes.js'
app.use("/user",userRouter)

import videoRouter from './routes/video.routes.js'
app.use("/video",videoRouter)

import commentRouter from './routes/comment.routes.js'
app.use("/comment",commentRouter)

export {app} 