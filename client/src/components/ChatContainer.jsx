import { SendIcon, SmilePlus, X, User2, Search, SearchCheckIcon, SearchIcon, SearchCode, SearchX, SearchSlash, Phone, VideoIcon, PhoneCall } from "lucide-react";
import { useStore } from "../pages/store";
import { useSocket } from "../context/SocketContext";
import EmojiPicker from 'emoji-picker-react';
import { useEffect, useRef, useState, useCallback } from "react";
import { format } from "date-fns";
import axios from "axios";
import {motion} from "framer-motion"
const ChatContainer = () => {
    const scrollRef = useRef(null);
    const [openEmoji, setOpenEmoji] = useState(false);
    const [message, setMessage] = useState('');
    const { selectedChatData, setSelectedChatData, setSelectedChatType, userInfo, selectChatMessages, setSelectedChatMessages, userTypingId } = useStore();
    const socket = useSocket();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message && socket) {
            socket.emit('send-message', { sender: userInfo._id, recipient: selectedChatData._id, content: message });
            setMessage('');
        } else {
            alert("No Message or socket error!");
        }
        setOpenEmoji(false);
    };

    const handleEmojiClick = (emoji) => setMessage((prev) => prev + (emoji.native || emoji.emoji));

    useEffect(() => {
        scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, [selectChatMessages]);

    const getPrevMessages = useCallback(async () => {
        if (!selectedChatData) return;
        try {
            const res = await axios.post(
                'http://localhost:9000/api/contacts/get-prev-messages',
                { userId: selectedChatData._id },
                { withCredentials: true }
            );
            if (res.status === 200) setSelectedChatMessages(res.data.messages);
        } catch (error) {
            console.error("Error loading messages:", error.message);
        }
    }, [selectedChatData, setSelectedChatMessages]);

    useEffect(() => { getPrevMessages(); }, [getPrevMessages]);

    const renderMessages = () => {
        let previousDate = '';
        let previousUser = '';
        return selectChatMessages?.map((message, i) => {
            const messageDate = format(message.timestamp, 'yyyy-MM-dd');
            const currentUser = message.sender === userInfo._id ? "sender" : "recipient";
            const showDate = previousDate !== messageDate;
            const showProfile = previousUser !== currentUser || previousDate !== messageDate;
            previousDate = messageDate;
            previousUser = currentUser;

            return (
                <div key={i}>
                    {showDate && (
                        <div className="w-full flex justify-center items-center p-3">
                            <span className="border border-black rounded-lg px-2 hover:bg-black text-xs cursor-pointer hover:text-white">{messageDate}</span>
                        </div>
                    )}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                    className={`flex w-full ${currentUser === "sender" ? "justify-end" : "justify-start"} px-3 py-2`}>
                        <div className={`${showProfile ? currentUser == "sender" ?  'rounded-tr-none' : 'rounded-tl-none' : ''} bg-${currentUser === "sender" ? 'blue-500 text-white' : ' text-blue-500 border-blue-500 border border-blue-500'} min-w-[50px] relative px-2 py-1 pb-2 pr-5 h-auto max-w-[40%] overflow-hidden rounded-lg flex flex-col break-words`}>
                            {message.content}
                            <span className={`"absolute bottom-0 right-2 ${currentUser == "sender" ? 'text-gray-100 bg-blue-500 text-right' : 'text-blue-500 text-left'}  text-opacity-90 text-[.5em]`}>{format(message.timestamp, 'p')}</span>
                        </div>
                    </motion.div>
                </div>
            );
        });
    };

    const handleTyping = useCallback(() => {
        if (message && socket) socket.emit('typing', { sender: userInfo._id, recipient: selectedChatData._id });
    }, [message, socket, userInfo, selectedChatData]);

    return (
        <div className="flex flex-col w-full pointer-events-auto gap-2 p-5 items-center">
            {/* header */}
            <div className="flex items-center gap-1 pb-2 justify-between w-full border-b border-black ">
                <div className="flex  gap-5 p-0   items-center">
                    <div className="rounded-full p-1 bg-gray-200 flex w-10 h-10 items-center justify-center "><User2 /></div>
                </div>
                <div className="flex-1 h-full hover:bg-gray-100 px-5 cursor-pointer py-1 rounded-sm ">
                    <div className="flex flex-col">
                        <span className="text-xl font-semibold text-opacity-70">{selectedChatData.name}</span>
                        {userTypingId === selectedChatData?._id ? (
                            <motion.span 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className="typing-indicator text-xs text-blue-500"
                            >
                                Typing . . .
                            </motion.span>
                        ) : (
                            <motion.span 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className="typing-indicator text-xs text-blue-500"
                            >
                                Last Seen  12:20 AM TODAY
                            </motion.span>
                        )}                    

                    </div>
                </div>
                <div className="flex gap-2">    
                    <div className="p-1 hover:bg-gray-100 cursor-pointer rounded-md shadow-sm border ">
                        <Phone size={23}/>
                    </div>
                    <div className="p-1 hover:bg-gray-100 cursor-pointer rounded-md shadow-sm border ">
                        <VideoIcon size={25}/>
                    </div>
                    <div className="p-1 hover:bg-gray-100 cursor-pointer rounded-md shadow-sm border ">
                        <Search size={25}/>
                    </div>
                </div>
            </div>

            <div className="messages flex-1 flex flex-col w-full overflow-y-scroll scrollbar-hide">
                {renderMessages()}
                <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex items-center py-5 gap-6 w-full max-w-5xl">
                <div className="h-full p-2 relative flex items-center justify-center">
                    {openEmoji && (
                        <div className="absolute bottom-[100%]">
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}
                    <SmilePlus size={40} className="cursor-pointer" onClick={() => setOpenEmoji(!openEmoji)} />
                </div>
                <input value={message} onChange={(e) => { setMessage(e.target.value); handleTyping(); }} type="text" className="outline-none flex-1 focus:ring-2 border border-gray-500 rounded-full px-5 py-3" placeholder="Message..." />
                <button type="submit" className="rounded-full hover:bg-gray-100 text-blue-500 p-3 flex items-center justify-center">
                    <SendIcon size={35} />
                </button>
            </form>
        </div>
    );
};

export default ChatContainer;
