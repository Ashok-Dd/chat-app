import {Router} from "express";
import { checkAuth, login, logout, register } from "../controllers/AuthControllers.js";
import { verifyToken } from "../middlewares/VerifyToken.js";

const router = Router();



router.post('/signup' , register)
router.post('/login' , login)
router.post('/logout' , logout)
router.get('/check-auth' , verifyToken , checkAuth)

export default router;