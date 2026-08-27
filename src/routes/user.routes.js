import {userRegisteration,loginUser,logoutUser} from '../controllers/user.controller.js'
import { upload } from '../middleware/multer.middleware.js'
import express from 'express'
import {verifyJwt} from '../middleware/auth.middleware.js'
const router = express.Router()

console.log("upload:", typeof upload)
console.log("userRegisteration:", typeof userRegisteration)
console.log("loginUser:", typeof loginUser)
console.log("verifyJwt:", typeof verifyJwt)
router.route('/register').post(
    upload.fields([
        {name:"profilePicture",maxCount:1},
        {name:"coverImage",maxCount:1}
    ]),
    userRegisteration
)

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJwt,logoutUser)



export default router