import {Router} from "express";
import { verifyToken } from "../middlewares/VerifyToken.js";
import { getAllDmMessages, getAllUsers, getPreviousMessages } from "../controllers/contactControllers.js";

const router = Router();



router.post('/search' , verifyToken , getAllUsers)
router.get('/get-messages-list' , verifyToken , getAllDmMessages);
router.post('/get-prev-messages' , verifyToken , getPreviousMessages);

export default router;