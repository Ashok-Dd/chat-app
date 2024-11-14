import  {Server} from "socket.io";
import Messages from "./models/MessageModel.js";

export const setUpSocket = (server) => {
    // creating socket in backend (io)
    const backendServer  = new Server(server , {
        cors : {
            origin : "http://localhost:5173" , credentials : true
        }
    })
    
    // map to store users who are connecting

    const userSocketMap = new Map();

    const disconnect = (socket) => {
       for(let [userId , socketId] of userSocketMap.entries() ) {
        if(socketId === socket.id) {
            userSocketMap.delete(userId);
            break;
        }
       }

       let userOnline = [];
       for(let [key , value ] of userSocketMap) {
           userOnline = [...userOnline , key]
       }
       backendServer.emit('online-list' , userOnline)
    }

    const sendMessage = async  (message) => {
        const senderSocketId = userSocketMap.get(message.sender)
        const recipientSocketId = userSocketMap.get(message.recipient);


        const createdMessage = await Messages.create({
            ...message
        });

        const messageData = await Messages.findById(createdMessage._id)
                                          .populate("sender" , "id email name")
                                          .populate("recipient" , "id email name")

        if(recipientSocketId) {
            backendServer.to(recipientSocketId).emit("recieve-message" , messageData);
        }

        if(senderSocketId) {
            backendServer.to(senderSocketId).emit('recieve-message' , messageData);
        }
    }

    const handleTypingChange = (data) => {
        const recipientSocketId = userSocketMap.get(data.recipient);
        console.log(data);
        backendServer.to(recipientSocketId).emit('typed', data.sender);
    }
    
    backendServer.on("connection" , (socket) => {
        const userId = socket.handshake.query.userId;

        if(userId) {
            userSocketMap.set(userId , socket.id);
            console.log("User with " , userId , "Connected.");
            let userOnline = [];
            for(let [key , value ] of userSocketMap) {
                userOnline = [...userOnline , key]
            }
            backendServer.emit('online-list' , userOnline)
        }else {
            console.log("user id is not provided");
        }

        socket.on("send-message" , sendMessage)
        socket.on("disconnect" , () => disconnect(socket))
        socket.on('typing' , handleTypingChange)
        
    })

}

