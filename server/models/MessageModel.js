import mongoose from "mongoose";

const messageSchem = new mongoose.Schema({
    sender : {type : mongoose.Schema.Types.ObjectId  , required : true , ref : "User"} ,
    recipient : {
        type : mongoose.Schema.Types.ObjectId , required : false , ref : "User" ,
    },
    content : {
        type : String ,
         required : true
    } ,
    timestamp : {
        type : Date ,
         default : Date.now
    }
})

export default  mongoose.model("Messages" , messageSchem);