import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config({
    path:'./.env'
})
app.use(express.json())



export {app} 