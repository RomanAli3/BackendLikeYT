import express from "express"
import { getAllLike, getLikeOnVideo, likeVideo } from "../controllers/like.controller.js"
import { verifyJwt } from "../middleware/auth.middleware.js"

const router =express.Router()

router.route("/like-unLike/:videoId").post(verifyJwt,likeVideo)
router.route("/all-likes").get(getAllLike)
router.route("/all-video-likes/:videoId").get(getLikeOnVideo)

export default router