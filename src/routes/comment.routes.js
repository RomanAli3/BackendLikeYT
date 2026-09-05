import express from 'express'
import { verifyJwt } from '../middleware/auth.middleware.js'
import { addComment, deleteComment, getAllComments, getVideoComments } from '../controllers/comment.controller.js'

const router =express.Router()


router.route("/post-comment/:videoId").post(verifyJwt,addComment)

router.route("/delete-comment/:commentId").delete(verifyJwt,deleteComment)
router.route("/get-all-comments").get(getAllComments)
router.route("/get-video-comments/:videoId").get(getVideoComments)


export default router