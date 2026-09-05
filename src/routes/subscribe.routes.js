import express from 'express'
import { verifyJwt } from "../middleware/auth.middleware.js"
import { subscribeOrUnsubscribe,getChannelSubscribed } from '../controllers/subscribe.controller.js'
const router = express.Router()

router.route('/subscribe-unSubscribe/:channelId').post(verifyJwt,subscribeOrUnsubscribe)
router.route('/get-subscribers/:channelId').get(getChannelSubscribed)

export default router