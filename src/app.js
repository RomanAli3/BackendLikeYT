import express from 'express'
import cookieParser from 'cookie-parser'
const app = express()
import dotenv from 'dotenv'
dotenv.config({
    path:'./.env'
})
app.use(express.json())
app.use(cookieParser())


export {app} 