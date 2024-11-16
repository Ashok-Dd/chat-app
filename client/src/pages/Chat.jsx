import { useStore } from "./store";
import EmptyChatContainer from '../components/EmptyChatContainer'
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import {motion , AnimatePresence} from "framer-motion"
import ContactSearch from "../components/ContactSearch";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Chat = () => {

    const {userInfo , selectedChatData , setOpenContactBar , openContactsBar} = useStore();
    const navigate = useNavigate()

    useEffect(() => {
        if(userInfo && !userInfo.isVerified) {
            navigate('/profile')
        } 
    } , [])
    return (
        <div className=" flex h-screen w-full ">
           
           <div className="w-full lg:w-[380px] ">
                <Sidebar/>
           </div> 
           <div className="fixed top-0 right-0 bottom-0 left-0  lg:static bg-theme-300  flex-1 flex pointer-events-none">
                {!selectedChatData ? (
                    <EmptyChatContainer />
                ) : (
                    <ChatContainer/>
                )}
           </div>
           <AnimatePresence>
           {openContactsBar && (
                <motion.div
                    initial={{ width: 0 }}  // Start outside the viewport to the right
                    animate={{ width: openContactsBar ? 400 : 0}}  // Slide in or out
                    transition={{ type: "tween", duration: 0.3 }}
                    exit={{width : 0}}
                    className=" w-[500px] p-2 bg-theme-100 shadow-lg overflow-hidden"
                >
                    <ContactSearch />
                </motion.div>
           )}
           </AnimatePresence>

        </div>
    )
}


export default Chat;