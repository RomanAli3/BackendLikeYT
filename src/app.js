import express from 'express'
import cookieParser from 'cookie-parser'
const app = express()
import cors from "cors";

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

import dotenv from 'dotenv'
dotenv.config({
    path:'./.env'
})
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true })); 

import userRouter from './routes/user.routes.js'
app.use("/user",userRouter)

import videoRouter from './routes/video.routes.js'
app.use("/video",videoRouter)

import commentRouter from './routes/comment.routes.js'
app.use("/comment",commentRouter)

import likeRouter from './routes/like.routes.js'
app.use("/like",likeRouter)

import subscribeRouter from './routes/subscribe.routes.js'
app.use("/subscribe",subscribeRouter)
import { apiErrorHandling } from './utils/ErrorHandling.js';
app.use(apiErrorHandling)
export {app} 