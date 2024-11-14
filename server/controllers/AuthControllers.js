import {User} from "../models/UserModel.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
export const login = async (req , res) => {
    try {
        const {email , password} = req.body;

        if(!email || !password) {
            return res.status(400).json({message : "All fields are required"});
        }

        const user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({message : "email not exits"})
        }

        const isPasswordMatched = await bcrypt.compare(password ,  user.password);
        if (!isPasswordMatched) {
            return res.status(400).json({message : "Incorrect password"})
        }



        // need to revise
        const token = jwt.sign({userId : user._id} ,process.env.JWT_SECRET, {expiresIn : "24h"} );


        // need to learn
        res.cookie("authToken" , token , {
            httpOnly : true ,
            sameSite : "strict" ,
            maxAge : 24 * 60 * 60 * 1000,
            secure : process.env.NODE_ENV === "production"
        });
        

        return res.status(200).json({
            message : "login successfull",
            user : {
                ...user._doc ,
                password : undefined
            }
        })
    } catch (error) {
        console.log("Error in login " , error.message);
        return res.status(500).json({message : "Internal server error"})
    }
}

export const register = async (req , res) => {
    try {
        const {name , email , password } = req.body; 

        
        if(!email || !password || !name) {
            return res.status(400).json({message : "All fields are required"});
        }

        const isExist = await User.findOne({email});
        if(isExist) {
            return res.status(400).json({message : "user already exist with email"});
        }

        const hashedPassword = await bcrypt.hash(password , 10);
        const user = await User.create({
            email , name , password :  hashedPassword
        })

        // need to revise
        const token = jwt.sign({userId : user._id} ,process.env.JWT_SECRET, {expiresIn : "24h"} );


        // nee  d to learn
        res.cookie("authToken" , token , {
            httpOnly : true ,
            sameSite : "strict" ,
            maxAge : 24 * 60 * 60 * 1000,
            secure : process.env.NODE_ENV === "production"
        });

        return res.status(200).json({
            message : "user created successfully",
            user : {
                ...user._doc , // doubt
                password : undefined
            }
        })

    } catch (error) {
        console.log("Error registering " , error.message);
        return res.status(500).json({message : "Internal server error"})
    }
}



export const checkAuth = async ( req , res) => {
    try {

        const user = await User.findById(req.userId).select("-password");

        if(!user) {
            return res.status(400).json({message : "email not exits"})
        }
        
        return res.status(200).json({
            user
        })
    } catch (error) {
        console.log("Error checking auth " , error.message);
        return res.status(500).json({message : "Internal server error"})
        
    }
}


export const logout = async (req , res) => {
    res.clearCookie("authToken" , {
            httpOnly : true ,
            sameSite : "strict" ,
            maxAge : 24 * 60 * 60 * 1000,
            secure : process.env.NODE_ENV === "production"
        });
        return res.status(200).json({success : true , message : "logged out successfully"})
}