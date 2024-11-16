import { SendIcon, SmilePlus, Search, Phone, VideoIcon, X, ArrowUp, ArrowDown } from "lucide-react";
import { useStore } from "../pages/store";
import { useSocket } from "../context/SocketContext";
import EmojiPicker from 'emoji-picker-react';
import { useEffect, useRef, useState, useCallback } from "react";
import { format } from "date-fns";
import axios from "axios";
import {AnimatePresence, motion} from "framer-motion"
import Avatar from "./Avatar";
import ContactProfile from "./ContactProfile";
import {FaAngleDown, FaEdit, FaReply, FaShare, FaSmileBeam, FaTrash} from "react-icons/fa"
const ChatContainer = () => {
    const inputRef = useRef(null);
    const scrollRef = useRef(null);
    const profileRef = useRef(null);
    const emojiRef = useRef(null)
    const editRef = useRef(null);
    const containerRef = useRef(null);

    const [message, setMessage] = useState('');             {/*main message input */}
    const [finderText , setFinderText] = useState('');
    const [openFinder , setOpenFinder] = useState(false);
    const [openEmoji, setOpenEmoji] = useState(false);
    const [openProfile , setOpenProfile] = useState(false);
    const [openSearch , setOpenSearch] = useState(false);
    const [searchedArrayIndex , setSearchedArrayIndex] = useState(searchedArrayRefs.length - 1)
    const [selectedMessage , setSelectedMessage] = useState(null);
    const [selectedReplyMessage , setSelectedReplyMessage] = useState(null);
    const { selectedChatData, userInfo,setOpenForwardBar , openContactsBar , setOpenContactBar , selectChatMessages, setSelectedChatMessages, userTypingId } = useStore();
    const socket = useSocket();

    useEffect(() => {
        searchedArrayIndexRef.current = searchedArrayIndex;
    }, [searchedArrayIndex]);
    

    useEffect(() => {
        searchedArrayRefs.current = [];
    }, [searchedMessage]);
    
    // Update searchedArrayIndex when searchedMessage changes
    useEffect(() => {
        if (searchedArrayRefs.current.length > 0) {
            setSearchedArrayIndex(0); // Start with the first occurrence
        } else {
            setSearchedArrayIndex(-1); // No matches found
        }
    }, [searchedMessage]);




    useEffect(() => {
        const handleClick = (e) => {

            if (profileRef?.current && !profileRef.current.contains(e.target)) {
                    setOpenProfile(false);
            }
            if (emojiRef?.current && !emojiRef.current.contains(e.target)) {
                    setOpenEmoji(false);
            }
            if (editRef?.current && !editRef.current.contains(e.target) && !e.target.closest(".inside-edit-ref")) {
                setSelectedMessage(null);
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
            socket.emit('send-message' , { sender: userInfo._id, recipient: selectedChatData._id, content: message , parentMessage : selectedReplyMessage?._id ? selectedReplyMessage?._id : undefined })
            if(selectedReplyMessage) {
                setSelectedReplyMessage(null);
            }
            setMessage('');
        } else {
            alert("No Message or socket error!");
        }
        setOpenEmoji(false);
    };

    const handleEmojiClick = (emoji) => setMessage((prev) => prev + (emoji.native || emoji.emoji));

    useEffect(() => {
        scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
    } , [selectChatMessages]);

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



    const toggleMessage = (id) => {
        setSelectedMessage(id)
    };

    const handleReplyClick = (message) => {
        setSelectedReplyMessage(message);
        setSelectedMessage(null)
    };
    

    const getMatchedMessage = (message) => {
        return message.parentMessage ? (
            <div className="flex flex-col w-full">
                <div className={`w-full rounded-lg border-l flex flex-col border-white text-sm p-2  ${message.sender === userInfo._id ? "bg-blue-400" : 'bg-blue-500'}`}>
                    <span className="text-sm text-white">
                        {message.parentMessage.sender === userInfo._id ? "You" : selectedChatData?.name}
                    </span>
                    {message.parentMessage.content}
                </div>
                {message.content}
            </div>
        ) : message.isForwarded ? (
            <div className="flex flex-col w-full">
                <div className={`w-full rounded-lg  flex flex-col text-sm p-1  `}>
                    <span className="text-sm text-white flex items-center gap-2">
                        <FaShare/> {"Forwarded"}
                    </span>
                </div>
                {message.content}
            </div>
        ) : message.content;
    }

    const handleToggleForwardBar = (message) => {
        if(openContactsBar) {
            setOpenContactBar(false);
        }
        setOpenForwardBar(message);
        setSelectedMessage(null);
    }


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
                            <div className={`${showProfile ? currentUser === "sender" ? 'rounded-tr-none' : 'rounded-tl-none' : ''} bg-${currentUser === "sender" ? 'blue-500 text-white' : 'text-blue-500 border-blue-500 border'}  min-w-[150px] w-full lg:text-xl h-auto max-w-[500px] relative px-2 py-1 pb-2 pr-5  rounded-lg flex flex-col `}>
                                <div onClick={() => toggleMessage(message._id)} className={`group-hover:flex pointer-events-auto hover:flex absolute top-[50%] translate-y-[-50%] ${currentUser == "sender" ? 'right-[110%]' : 'left-[110%]'} items-center cursor-pointer justify-center ${currentUser == "sender" ? '' : "flex-row-reverse"} ${selectedMessage === message._id ? 'flex' : 'hidden'}`}>
                                    <FaAngleDown className="font-thin tracking-wider" />
                                    <FaSmileBeam />
                                </div>
                                {getMatchedMessage(message)}
                                <span className={`absolute bottom-0 right-2 ${currentUser === "sender" ? 'text-gray-100 bg-blue-500 text-right' : 'text-blue-500 text-left'} text-opacity-90 text-[.5em]`}>{format(message.timestamp, 'p')}</span>
                            </div>
                            <div
                                ref={editRef}
                                style={{ position: 'absolute', right : currentUser === "sender" ? '150%' : '-250%', left: '', zIndex: 9999 }}
                                className="pointer-events-auto"
                            >
                                <AnimatePresence>
                                    {selectedMessage === message._id && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: 300 } }
                                            exit={{ height: 0 }}
                                            transition={{ duration: 0.4 }}
                                            className=" bg-transparent z-50 pointer-events-auto inside-edit-ref flex flex-col items-center gap-5  shadow-lg overflow-hidden rounded-lg"
                                        >
                                            <EmojiContainer/>
                                            <div  className="flex flex-col gap-1 bg-zinc-800 w-full pointer-events-auto border border-theme-100 shadow-lg rounded-lg">
                                                <button onClick={() => handleReplyClick(message)} className="flex items-center pointer-events-auto w-full px-3 py-2 text-lg capitalize border-b border-gray-700 hover:bg-zinc-700 transition">
                                                    <FaReply  className="mr-2 text-blue-500 pointer-events-auto" /> Reply
                                                </button>
                                                <button onClick={() => handleToggleForwardBar(message)} className="flex items-center w-full px-3 py-2 text-lg capitalize border-b border-gray-700 hover:bg-zinc-700 transition">
                                                    <FaShare className="mr-2 text-blue-500" /> Forward
                                                </button>
                                                <button className="flex items-center w-full px-3 py-2 text-lg capitalize hover:bg-zinc-700 transition">
                                                    <FaEdit className="mr-2 text-blue-500" /> Edit
                                                </button>
                                                <button className="flex items-center w-full px-3 py-2 text-lg capitalize hover:bg-zinc-700 transition">
                                                    <FaTrash className="mr-2 text-blue-500" /> Delete
                                                </button>
                                            </div>
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


    const handleUp = {}
    const handleDowm = {}



    

    const handleTyping = useCallback(() => {
        if (message && socket) socket.emit('typing', { sender: userInfo._id, recipient: selectedChatData._id });
    }, [message, socket, userInfo, selectedChatData]);

    return (
        <div className="flex relative flex-col w-full pointer-events-auto gap-2 p-5 items-center">
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
                        {openFinder ? <X size={27} onClick={() => setOpenFinder(false)}/> : <Search onClick={() => setOpenFinder((prev) => !prev)} size={27}/> }
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

                <AnimatePresence>
                    {openFinder && <motion.div className=" w-full max-w-[500px] h-full max-h-[55px] absolute top-20 right-10 rounded-lg bg-[#383838] flex items-center justify-around p-1 z-50"
                        initial={{opacity:0 , y:-10}}
                        animate={{opacity:1 , y:0}}
                        exit={{opacity:0 , y:-10}}
                    >
                        <input type="text" value={finderText} className="w-full max-w-[80%] p-2 rounded bg-transparent border-b outline-none text-gray-300 placeholder:text-gray-100" placeholder="Search within Chat" onClick={(e) => setFinderText(e.target.value)} />
                        <button onClick={() => handleUp()} className="border border-gray-500 p-2 rounded w-[8%] hover:bg-[#212121] flex items-center justify-center"><ArrowUp/></button>
                        <button onClick={() => handleDown()}className="border border-gray-500 p-2 rounded w-[8%] hover:bg-[#212121] flex items-center justify-center"><ArrowDown/></button>
                    </motion.div>}
                </AnimatePresence>
            </div>



            <div ref={containerRef} className="messages flex-1 flex flex-col w-full max-w-6xl overflow-y-scroll scrollbar-hide">
                {renderMessages()}
                <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex relative items-center py-5 gap-6 w-full max-w-5xl">
                { selectedReplyMessage && (
                    <motion.div
                        style={{ width : inputRef?.current?.clientWidth }}
                        className="absolute bottom-[80%] left-0 w-full"
                        initial={{ height: 0 }} 
                        animate={{ height: "auto" }} 
                        transition={{ duration: 0.1 }} 
                    >
                        <div className="h-full rounded-t-xl p-1 px-4  flex flex-col  bg-zinc-800">
                            <div className="w-full relative flex flex-col gap-2 rounded-lg border-l-[2px] border-blue-500 px-3 py-2">
                                <div className="w-full absolute flex justify-end">
                                    <X onClick={() => setSelectedReplyMessage(null)} className="cursor-pointer hover:bg-zinc-500 rounded-full text-xs p-1" size={20}/>
                                </div>
                                <span className="text-blue-500 capitalize ">{selectedReplyMessage.sender === userInfo._id ? "You" : selectedChatData.name}</span>
                                <span className="text-white w-full ">{selectedReplyMessage.content}</span>
                            </div>
                        </div>
                    </motion.div>
                ) }
                <div className="h-full p-2 absolute left-2 flex items-center justify-center">
                    {openEmoji && (
                        <div ref={emojiRef} className="absolute bottom-[100%]">
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}
                    <SmilePlus size={20} className="cursor-pointer" onClick={() => setOpenEmoji(!openEmoji)} />
                </div>
                <input ref={inputRef} value={message} onChange={(e) => { setMessage(e.target.value); handleTyping(); }} type="text" className="outline-none  pl-16 flex-1 bg-transparent focus:ring-2 focus:ring-blue-500 border border-gray-500 rounded-full px-5 py-3" placeholder="Message..." />
                <button type="submit" className="rounded-full  text-blue-500 p-3 flex items-center justify-center">
                    <SendIcon size={35} />
                </button>
            </form>
        </div>
    );
};

export default ChatContainer;


const EmojiContainer = ({}) => {
    const emojis = ["👍", "😊", "😠", "❤️", "😂", "😢"]; 

    return (
        <motion.div initial={{opacity : 0 , width : 0}} animate={{opacity : 1 , width : "100% "}} transition={{duration : 0.5 , delay : 0.1}} className="rounded-full bg-zinc-700 flex-center gap-3 overflow-hidden">
            {emojis.map((emoji , index) => (
                <span
                    key={index}
                    className="text-2xl cursor-pointer hover:scale-110 transition-transform"
                >
                    {emoji}
                </span>
            ))}
        </motion.div>
    )
}


