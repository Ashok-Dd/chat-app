import { ArrowLeft, Search, User, X } from "lucide-react"
import { useStore } from "../pages/store";
import { useEffect, useState } from "react";

const ContactSearch = () => {
    const {setOpenContactBar , openContactsBar , setSelectedChatData , setSelectedChatType } = useStore()
    const [contacts , setContacts]  = useState([]);
    const [search , setSearch] = useState('');


    const handleClick = (contact) => {
        setSelectedChatData(contact);
        setSelectedChatType("solo")
        setShowModel(false);
    }

    useEffect(() => {
        handleSearch();
    } , [search])


    const handleSearch = async () => {
        try {
            const response = await fetch('http://localhost:9000/api/contacts/search', {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"  
                },
                credentials: "include",
                body: JSON.stringify({ searchTerm: search })  
            });
    
            if (response.ok) {
                const data = await response.json();
                setContacts(data.contacts);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="w-full h-full  px-3 py-5 flex text-[#FAFAFA]">
            <div className="rounded-lg shadow-md flex-1 bg-[#212121] px-2 flex flex-col gap-3">
                <div className="w-full p-1 flex bg-[#212121]  justify-end">
                    <X className="rounded-full hover:bg-[#383838] p-1 bg-transparent cursor-pointer" onClick={() => setOpenContactBar(!openContactsBar)} size={23}/>
                </div>

                <div className="w-full flex relative">
                    <Search size={20} className="absolute top-[50%] translate-y-[-50%] left-2"/>
                    <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search Users" className="flex-1 py-1  border-b border-black px-3 pl-10  outline-none " />
                </div>

                <div className="w-full flex flex-col bg-[#212121] ">
                    <span className="text-xs capitalize text-[#A6A6A6] bg-[#212121]">Users on this website</span>
                    <div className="w-full flex flex-col overflow-y-scroll">
                        {contacts.map((contact , index) => (
                            <div onClick={() => handleClick(contact)} className="w-full bg-[#212121] rounded-sm flex p-1  items-center cursor-pointer hover:bg-[#383838]">
                                <div className="rounded-full h-7 w-7 p-1  text-white flex items-center justify-center  ">
                                    <User className="bg-transparent"/>
                                </div>
                                <div className="flex-1 p-2  bg-transparent flex flex-col">
                                    <span className="bg-transparent ">{contact.name}</span>
                                    <span className="text-xs bg-transparent ">{contact.email}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactSearch