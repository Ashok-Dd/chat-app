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
    },
    parentMessage : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Messages",
        default : null
    },
    isForwarded : {type : Boolean , default : false}
})

export default  mongoose.model("Messages" , messageSchem);