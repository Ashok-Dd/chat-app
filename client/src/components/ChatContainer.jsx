import { SendIcon, SmilePlus, Search, Phone, VideoIcon } from "lucide-react";
import { useStore } from "../pages/store";
import { useSocket } from "../context/SocketContext";
import EmojiPicker from 'emoji-picker-react';
import { useEffect, useRef, useState, useCallback } from "react";
import { format } from "date-fns";
import axios from "axios";
import {AnimatePresence, motion} from "framer-motion"
import Avatar from "./Avatar";
import ContactProfile from "./ContactProfile";
import {FaAngleDown, FaSmileBeam} from "react-icons/fa"
const ChatContainer = () => {
    const scrollRef = useRef(null);
    const profileRef = useRef(null);
    const emojiRef = useRef(null)
    const editRef = useRef(null);
    const containerRef = useRef(null);
    const [openEmoji, setOpenEmoji] = useState(false);
    const [message, setMessage] = useState('');
    const [openProfile , setOpenProfile] = useState(false);
    const [selectedMessage , setSelectedMessage] = useState(null);
    const { selectedChatData, setSelectedChatData, setSelectedChatType, userInfo, selectChatMessages, setSelectedChatMessages, userTypingId } = useStore();
    const socket = useSocket();


    useEffect(() => {
        const handleClick = (e) => {
            if (profileRef?.current && !profileRef.current.contains(e.target)) {
                setOpenProfile(false);
            }
            if (emojiRef?.current && !emojiRef.current.contains(e.target)) {
                setOpenEmoji(false);
            }
            if (editRef?.current && !editRef.current.contains(e.target)) {
                setSelectedMessage(false);
            }
    
        }
        window.addEventListener('mousedown' , handleClick)
        
        return (() => {
            
            window.removeEventListener('mousedown' , handleClick)
        })
    } , [])


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

    useEffect(() => {console.log(selectedMessage)} , [selectedMessage] )

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
                        className={`flex w-full ${currentUser === "sender" ? "justify-end" : "justify-start"} px-3 py-2 group`}
                    >
                        <div className={`relative flex  ${currentUser === "sender" ? "justify-end" : "justify-start"}`}>
                            <div className={`${showProfile ? currentUser === "sender" ? 'rounded-tr-none' : 'rounded-tl-none' : ''} bg-${currentUser === "sender" ? 'blue-500 text-white' : 'text-blue-500 border-blue-500 border'}  min-w-[100px] lg:text-xl h-auto max-w-[40%] relative px-2 py-1 pb-2 pr-5  rounded-lg flex flex-col break-words`}>
                                <div onClick={() => toggleMessage(message._id)} className={`group-hover:flex pointer-events-auto hover:flex absolute top-[50%] translate-y-[-50%] ${currentUser == "sender" ? 'right-[110%]' : 'left-[110%]'} items-center cursor-pointer justify-center ${currentUser == "sender" ? '' : "flex-row-reverse"} ${selectedMessage === message._id ? 'flex' : 'hidden'}`}>
                                    <FaAngleDown className="font-thin tracking-wider" />
                                    <FaSmileBeam />
                                </div>
                                {message.content}
                                <span className={`absolute bottom-0 right-2 ${currentUser === "sender" ? 'text-gray-100 bg-blue-500 text-right' : 'text-blue-500 text-left'} text-opacity-90 text-[.5em]`}>{format(message.timestamp, 'p')}</span>
                            </div>
                            <div
                                ref={editRef}
                                style={{ position: 'absolute', right : currentUser === "sender" ? '150%' : '-250%', left: '', zIndex: 9999 }}
                            >
                                <AnimatePresence>
                                    {selectedMessage === message._id && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: "auto" } }
                                            exit={{ height: 0 }}
                                            transition={{ duration: 0.1 }}
                                            className="w-[200px] bg-white border border-gray-300 shadow-lg overflow-hidden rounded-lg"
                                        >
                                            <p className="p-2 text-sm text-gray-700">Edit options here</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                        </div>
                    </motion.div>
                </div>
            );
        });
    };

    const toggleMessage = (id) => {
        setSelectedMessage((prev) => (prev === id ? null : id));
    };
    
    

    const handleTyping = useCallback(() => {
        if (message && socket) socket.emit('typing', { sender: userInfo._id, recipient: selectedChatData._id });
    }, [message, socket, userInfo, selectedChatData]);

    return (
        <div className="flex flex-col w-full pointer-events-auto gap-2 p-5 items-center">
            {/* header */}
            <div className="flex relative items-center gap-1 pb-2 justify-between w-full border-b border-[#ffffff16] ">
                <div className="flex  gap-5 p-0   items-center">
                    <Avatar image={selectedChatData?.profileImage} size={10} name={selectedChatData?.name} />
                </div>
                <div onClick={() => setOpenProfile((prev) => !prev)} className="flex-1 h-full px-5 cursor-pointer py-1 rounded-sm ">
                    <div className="flex flex-col">
                        <span className="text-xl font-semibold text-opacity-70">{selectedChatData.name}</span>
                        {userTypingId === selectedChatData?._id ? (
                            <motion.span 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className="typing-indicator bg-transparent text-xs text-blue-500"
                            >
                                Typing . . .
                            </motion.span>
                        ) : (
                            <motion.span 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className="typing-indicator bg-transparent text-xs text-blue-500"
                            >
                                Last Seen  12:20 AM TODAY
                            </motion.span>
                        )}                    

                    </div>
                </div>
                <div className="flex gap-2">    
                    <div className="p-1  cursor-pointer rounded-md shadow-sm  ">
                        <Phone size={27}/>
                    </div>
                    <div className="p-1  cursor-pointer rounded-md shadow-sm  ">
                        <VideoIcon size={27}/>
                    </div>
                    <div className="p-1  cursor-pointer rounded-md shadow-sm  ">
                        <Search size={27}/>
                    </div>
                </div>

                <div ref={profileRef} className="absolute top-[110%] left-5 z-50">
                    <AnimatePresence>
                    {openProfile && (
                            <motion.div
                                initial={{ height: 0 }}  
                                animate={{ height: 500  }}  
                                transition={{ type: "tween", duration: 0.3 }}
                                exit={{height : 0}}
                                className="w-[500px] shadow-lg overflow-hidden"
                            >
                                <ContactProfile user={selectedChatData} />
                            </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </div>

            <div ref={containerRef} className="messages flex-1 flex flex-col w-full max-w-6xl overflow-y-scroll scrollbar-hide">
                {renderMessages()}
                <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex relative items-center py-5 gap-6 w-full max-w-5xl">
                <div className="h-full p-2 absolute left-2 flex items-center justify-center">
                    {openEmoji && (
                        <div ref={emojiRef} className="absolute bottom-[100%]">
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}
                    <SmilePlus size={20} className="cursor-pointer" onClick={() => setOpenEmoji(!openEmoji)} />
                </div>
                <input value={message} onChange={(e) => { setMessage(e.target.value); handleTyping(); }} type="text" className="outline-none pl-16 flex-1 bg-transparent focus:ring-2 focus:ring-blue-500 border border-gray-500 rounded-full px-5 py-3" placeholder="Message..." />
                <button type="submit" className="rounded-full  text-blue-500 p-3 flex items-center justify-center">
                    <SendIcon size={35} />
                </button>
            </form>
        </div>
    );
};

export default ChatContainer;
