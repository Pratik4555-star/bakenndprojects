import { Router } from "express";
import { loginUser, registerUser, logOutUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post( 
    upload.fields([
        {
            name:"avtar",
            maxCount: 1
        },{
            name:"coverimgae",
            maxcount: 1
        }
    ]),
    registerUser)
router.route("/login").post(
    verifyJwt,
    loginUser
)


//secured routes 

router.route("/logout").post(
    verifyJwt ,logOutUser
)
export default router