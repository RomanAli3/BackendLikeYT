import express from 'express'
import { upload } from '../middleware/multer.middleware.js'
import { addVideo, deleteVideo } from '../controllers/video.controller.js'
import { verifyJwt } from '../middleware/auth.middleware.js'

const router =express.Router()

router.route("/upload-video").post(
    verifyJwt,
    upload.fields([
        {name:"video",maxCount:1},
        {name:"thumbnailUrl",maxCount:1}
    ]
    ),
    addVideo
)

router.route("/delete-video/:id").delete(verifyJwt,deleteVideo)

export default router