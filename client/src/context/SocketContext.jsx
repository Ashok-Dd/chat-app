import  { createContext , useContext , useEffect, useRef  } from "react";
import {io} from 'socket.io-client'
import { useStore } from "../pages/store";
const SocketContext = createContext(null);


export  const SocketProvider = ({children}) => {
    const socket = useRef(null);
    const {userInfo , setReload , setOnlineUsers } = useStore();
    
    useEffect(() => {
        if(userInfo) {
            socket.current = io("http://localhost:9000",{
                withCredentials : true ,
                query : {userId : userInfo._id}
            })


            socket.current.on("connect",() => {
                console.log("Connected to socket server");
            })

            const handleReciveMessage = (message) => {
                const {selectedChatType , selectedChatData , addMessage} = useStore.getState();
                
                setReload((prev) => !prev)
                if(selectedChatType !== undefined && (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)    )  {
                    addMessage(message);
                    console.log('Added');
                }
            };
    

            socket.current.on('typed' , (data) => {
                const {userTypingId , setUserTypingId} = useStore.getState();
                if(!userTypingId) {
                    setUserTypingId(data)
                    setTimeout(() => {
                        setUserTypingId(undefined);   
                    } , 3000    );
                }
            })
            socket.current.on("recieve-message",handleReciveMessage);
            socket.current.on('online-list' , (data) => {
                setOnlineUsers(data);
            });
            return (() => {
                socket.current.disconnect();
            })
        }   
    },[userInfo]);
    


    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
};



export const useSocket = () => {
    return useContext(SocketContext);
};