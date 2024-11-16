import {Router} from "express";
import { checkAuth, login, logout, register, updateProfile } from "../controllers/AuthControllers.js";
import { verifyToken } from "../middlewares/VerifyToken.js";
import multer from "multer"
const router = Router();

const uploads = multer({
    limits : {fileSize : 1 * 1024 * 1024}
})


router.post('/signup' , register)
router.post('/login' , login)
router.post('/logout' , logout)
router.get('/check-auth' , verifyToken , checkAuth)


router.put('/update-profile' , verifyToken , uploads.single("profileImage") , updateProfile )

export default router;