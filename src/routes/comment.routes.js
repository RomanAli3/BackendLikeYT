import express from 'express'
import { verifyJwt } from '../middleware/auth.middleware.js'
import { addComment, deleteComment, getAllComments } from '../controllers/comment.controller.js'

const router =express.Router()


router.route("/post-comment/:videoId").post(verifyJwt,addComment)

router.route("/delete-comment/:commentId").delete(verifyJwt,deleteComment)
router.route("/get-all-comments").get(getAllComments)

export default router