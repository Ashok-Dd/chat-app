import jwt  from "jsonwebtoken"

export const verifyToken = async (req , res , next) => {
    try {
        const token = req.cookies.authToken ;
        if(!token)  {
            return res.status(400).json({message : "unathorized user"});
        }
        
        const payLoad = jwt.verify(token , process.env.JWT_SECRET);
        
        if(!payLoad) {
            return res.status(400).json({message : "unathorized user"});
        }

        req.userId = payLoad.userId;
        next();        
    } catch (error) {
        return res.status(500).json({message : "Internal server error"})
    }
}