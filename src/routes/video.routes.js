import express from 'express'
import { upload } from '../middleware/multer.middleware.js'
import { addVideo, deleteVideo, getAllVideo, getSingleVideo, getUserVideo, updateVideo, viewAddInVideo } from '../controllers/video.controller.js'
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

router.route("/get-all-videos").get(getAllVideo)

router.route("/get-user-video").get(verifyJwt,getUserVideo)
router.route("/single-video/:videoId").get(getSingleVideo)
router.route("/view/:videoId").post(viewAddInVideo)

router.route("/update-video/:videoId").patch(verifyJwt,updateVideo)

export default router