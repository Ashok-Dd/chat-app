import { ArrowLeft, ArrowRight, Search, User, X } from "lucide-react"
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
        <div className="w-full h-full bg-theme-200 px-3 py-5 flex ">
            <div className="rounded-xl shadow-md flex-1   px-2 flex flex-col gap-3">
                <div className="w-full p-1 flex ">
                    <ArrowRight size={30} className="rounded-full hover:bg-theme-400 p-1 bg-transparent cursor-pointer" onClick={() => setOpenContactBar(!openContactsBar)} />
                </div>

                <div className="w-full flex relative">
                    <Search size={24} className="absolute top-[50%]  bg-transparent translate-y-[-50%] left-2"/>
                    <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search Users" className="flex-1 py-1 bg-transparent  border-b border-gray-300 px-3 pl-10  outline-none " />
                </div>

                <div className="w-full flex flex-col  ">
                    <span className="text-xs capitalize mb-4 text-[#A6A6A6] ">Users on this website</span>
                    <div className="w-full flex flex-col overflow-y-scroll">
                        {contacts.map((contact , index) => (
                            <div onClick={() => handleClick(contact)} className="w-full hover:bg-theme-500  rounded-sm flex p-1  items-center cursor-pointer hover:rounded-xl">
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