import { useStore } from "./store";
import EmptyChatContainer from '../components/EmptyChatContainer'
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import {motion , AnimatePresence} from "framer-motion"
import ContactSearch from "../components/ContactSearch";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ForwardBar from "../components/ForwardBar";
import { LogOut, Menu, MessageCircleCode, User, Users } from "lucide-react";

const Chat = () => {

    const {userInfo , selectedChatData , openForwardBar , openContactsBar} = useStore();
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
           {openContactsBar  && (
                <motion.div
                    initial={{ width: 0 }}  
                    animate={{ width: openContactsBar ? 400 : 0}} 
                    transition={{ type: "tween", duration: 0.3 }}
                    exit={{width : 0}}
                    className=" w-[500px] p-2 bg-theme-100 shadow-lg overflow-hidden"
                >
                    {(<ContactSearch />)}
                </motion.div>
           )}
           </AnimatePresence>
           <AnimatePresence>
           {openForwardBar  && (
                <motion.div
                    initial={{ width: 0 }}  
                    animate={{ width: openForwardBar ? 400 : 0}} 
                    transition={{ type: "tween", duration: 0.3 }}
                    exit={{width : 0}}
                    className=" w-[500px] p-2 bg-theme-100 shadow-lg overflow-hidden"
                >
                    <ForwardBar />
                </motion.div>
           )}
           </AnimatePresence>

           <div className="h-full border-r border-[#fafafa16]  p-2 flex flex-col">
                <div className="basis-[200px]">
                    <Menu className="cursor-pointer"/>
                </div>
                <div className="flex-1 flex  flex-col gap-5">
                    <MessageCircleCode className="cursor-pointer"/>
                    <Users className="cursor-pointer"/>
                </div>
                <div className="basis-[100px] space-y-2" >
                    <User className="cursor-pointer"/>
                    <LogOut onClick={() => setLogoutPop(true)} className="cursor-pointer"/>
                </div>
            </div>

        </div>
    )
}


export default Chat;