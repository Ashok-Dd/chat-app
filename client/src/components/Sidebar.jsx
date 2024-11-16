import {Dot, Heart, LogOut, LucideMenu, MessageCircleCode, MessageCircleMoreIcon, Search  
    ,  User,  UserPlus, Users, X} from "lucide-react"
import { useEffect, useState } from "react"
import {useStore} from "../pages/store"
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {format} from "date-fns"
import Avatar from "./Avatar";
const Sidebar = () => { 
    const [list , setList] = useState([]);
    const {setSelectedChatData , setSelectedChatType ,   setUserInfo , selectChatMessages , reload , onlineUsers , setOpenContactBar , openContactsBar} = useStore(); 
    const [logoutPop , setLogoutPop] = useState(false);
    const [searchTerm , setSearchTerm] = useState('')
    
    const navigate = useNavigate();

    
    const handleClick = (contact) => {
        setSelectedChatData(contact);
        setSelectedChatType("solo")
    }

    
    const handleLogout = async  () => {
        try {
            const response = await axios.post('http://localhost:9000/api/auth/logout', {} , {withCredentials : true});

            if(response.status === 200) {
                toast.success(response.data.message);
                setUserInfo(undefined);
                navigate('/login')
            }
        } catch (error) {
            console.log(error.message);
        }
    }


    useEffect(() => {
        const getList = async () => {
            try {   
                const response = await axios.get('http://localhost:9000/api/contacts/get-messages-list', {withCredentials : true});

                if(response.status === 200) {
                    setList(response.data.contacts)
                    console.log(response.data.contacts)
                }
            } catch (error) {
                console.log(error.message);
            }
        }

        getList()   
    } , [selectChatMessages , reload])




    const filteredData = list.filter((contact , i ) => contact.name.includes(searchTerm) || contact.email.includes(searchTerm))


    return (
        <div className="w-full border-r border-[#fafafa16]  h-full flex pointer-events-auto ">
            <div className="h-full border-r border-[#fafafa16]  p-2 flex flex-col">
                <div className="basis-[200px]">
                    <LucideMenu className="cursor-pointer"/>
                </div>
                <div className="flex-1 flex  flex-col gap-5">
                    <MessageCircleCode className="cursor-pointer"/>
                    <Users className="cursor-pointer"/>
                </div>
                <div className="basis-[100px] space-y-2" >
                    <User className="cursor-pointer"/>
                    <LogOut onClick={() => handleLogout(true)} className="cursor-pointer"/>
                </div>
            </div>

            {/* main */}
            <main className="flex-1 flex flex-col gap-2 px-2">
                <h1 className="text-blue-700  py-2 text-xl font-semibold uppercase tracking-wider flex gap-2 items-center"> <Heart/> Chat</h1> 

                <div className="w-full flex-1 flex flex-col gap-3  relative">

                    <div className="flex  items-center gap-3 relative">
                        <Search size={20} className="absolute top-[50%] translate-y-[-50%] left-2"/>
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}  placeholder="Search Contact" className="flex-1 py-1 pl-10 border-b bg-transparent border-gray-300 px-3  outline-none " />
                    </div>

                    <div className="flex flex-col flex-1 overflow-scroll">                                                
                        <div className="w-full flex flex-col">
                            {filteredData.map((contact , index) => (
                                <div key={index} onClick={() => handleClick(contact)}   className="w-full items-center px-1 flex gap-1 hover:bg-[#212121] cursor-pointer">
                                    <Avatar image={contact.profileImage} size={11} name={contact.name}/>
                                    <div className="flex-1 p-2 flex flex-col bg-transparent">
                                        <span className="p-1 flex items-center justify-between pr-5 bg-transparent  ">
                                            <span className="bg-transparent">{contact.name}</span>
                                            {
                                                onlineUsers.includes(contact._id) && (
                                                    <div className="flex flex-col items-center bg-transparent">
                                                        <span className="w-3 h-3 rounded-full bg-blue-500 text-white text-[.5em] flex items-center justify-center">!</span>
                                                        <span className="text-[.5em] text-blue-500 ">online</span>
                                                    </div>
                                                )
                                            }
                                        </span>
                                        <span className="text-xs bg-transparent flex items-center justify-between">
                                            <div className="bg-transparent"> 
                                                { contact.lastMessageContent.length > 20 ? contact.lastMessageContent.substring(0,20) + "..." : contact.lastMessageContent}
                                            </div>
                                            <div className="bg-transparent">
                                                {format(contact.lastMessageTime , 'p')}
                                            </div>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="absolute bottom-10 right-2">
                        <div onClick={() => setOpenContactBar(!openContactsBar)} class="relative p-[1px]  rounded-lg rounded-tl-none overflow-hidden cursor-pointer">
                            <div class="absolute inset-0 bg-gradient-to-r from-[hsla(222,100%,68%,1)] via-[hsla(336,87%,61%,1)] to-[hsla(262,81%,71%,1)]"></div>
                            <div class="relative rounded-lg py-2 px-3 text-2xl bg-theme-300">
                                <MessageCircleMoreIcon/>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
    

}

export default Sidebar


