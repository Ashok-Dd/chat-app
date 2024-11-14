import mongoose from "mongoose";

const UserSchema = new  mongoose.Schema({
    email : {
        type : String ,
        required : true
    } ,
    password : {
        type : String ,
        required : true
    } ,
    name : {
        type : String ,
        required : true
    } ,
    profileImage : {
        type : String 
    },
    about : {
        type : String
    },
      
})

export const User = mongoose.model("User" , UserSchema)