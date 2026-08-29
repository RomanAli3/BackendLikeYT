import {
    userRegisteration,
    loginUser,logoutUser,
     getCurrentUser,
     changeProfilePicture,
     changeCoverImage,
     changeUserPassword,
     changeFullName
    
    } from '../controllers/user.controller.js'
import { upload } from '../middleware/multer.middleware.js'
import express from 'express'
import {verifyJwt} from '../middleware/auth.middleware.js'
const router = express.Router()


router.route('/register').post(
    upload.fields([
        {name:"profilePicture",maxCount:1},
        {name:"coverImage",maxCount:1}
    ]),
    userRegisteration
)

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJwt,logoutUser)
router.route("/current-user").get(verifyJwt,getCurrentUser)
router.route("/change-profile-picture").patch(verifyJwt,
     upload.fields([
        {name:"profilePicture",maxCount:1},
    ]),
    changeProfilePicture
)
router.route("/change-cover-image").patch(verifyJwt,
     upload.fields([
        {name:"coverImage",maxCount:1},
    ]),
    changeCoverImage
)


router.route("/change-password").patch(verifyJwt,changeUserPassword)
router.route("/change-full-name").patch(verifyJwt,changeFullName)



export default router