import express from "express"
import { getAllLike, likeVideo } from "../controllers/like.controller.js"
import { verifyJwt } from "../middleware/auth.middleware.js"

const router =express.Router()

router.route("/like-unLike/:videoId").post(verifyJwt,likeVideo)
router.route("/all-likes").get(getAllLike)

export default router