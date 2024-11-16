import { ArrowRight, Check, CheckCircle2, CheckCircle2Icon, Search, SendHorizonal, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {AnimatePresence , motion} from "framer-motion"
import { useStore } from '../pages/store';
import Avatar from './Avatar.jsx';
import { Button } from '@mui/material';
import { FaSeedling } from 'react-icons/fa';
import { useSocket } from '../context/SocketContext.jsx';
function ForwardBar() {
  const [openSearch , setOpenSearch] = useState(false);
  const [search , setSearch] = useState('')
  const {setOpenForwardBar} = useStore();
  const [contacts , setContacts]  = useState([]);
  const [selectedContacts , setSelectedContacts] = useState([]);
  const {openForwardBar} = useStore();
  const socket = useSocket();
  const [error , setError] = useState(null);
  useEffect(() => {
      handleSearch();
  } , [search])

  const handleClick = (id) => {
    if(selectedContacts.includes(id)) {
      setSelectedContacts((prev) => prev.filter((data) => data !== id) );
    }else {
      setSelectedContacts((prev) => [...prev , id])
    }
  }

  const handleSendForwardMessage = () => {
    if(selectedContacts.length === 0 ) {
      setError("Select atleast one contact");
      return;
    }

    if(socket) {
      socket.emit('send-forward-message' , {message : openForwardBar , contacts : selectedContacts})
      setOpenForwardBar(undefined);
    }
  }


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
    <div className='w-full h-full  px-3 py-5 flex flex-col '>
      <div className="w-full p-1 flex gap-2 items-center justify-between">
            <ArrowRight onClick={() => {setOpenForwardBar(false)}} size={30} className="rounded-full hover:bg-theme-400 p-1 bg-transparent cursor-pointer" />
            <div className='flex-1 flex '>
              <AnimatePresence>
                {openSearch ? (
                  <motion.div 
                      initial={{ width: 0 }}  
                      animate={{ width: openSearch ? 'auto' : 0}} 
                      transition={{ type: "tween", duration: 0.3 }}
                      exit={{width : 0}}
                      className="overflow-hidden  flex-1"
                  >
                    <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search Users" className=" bg-transparent flex-1  border-b border-gray-300 px-1 w-full  outline-none " />
                  </motion.div>
                ) : (
                  <span className='w-full'> Forward To...</span>
                )}

              </AnimatePresence>     
            </div>
              {!openSearch ? (
                <Search  className='cursor-pointer' onClick={() => setOpenSearch(true)} size={20}/>
              ) : (
                <X className='cursor-pointer' onClick={() => setOpenSearch(false)} size={20}/>
              )}
      </div>

      <div className="w-full flex flex-col flex-1 ">
          <span className="text-xs capitalize mb-4 text-[#A6A6A6] ">Users on your Account</span>
          <div className="w-full flex flex-col  flex-1 h-full overflow-y-scroll">
              {contacts.map((contact , index) => (
                  <Button key={index} onClick={() => handleClick(contact)} className={` ${selectedContacts.includes(contact) ? 'bg-blue-500' : 'bg-transparent'}  relative w-full overflow-visible rounded-sm flex p-1 text-white  items-center cursor-pointer hover:rounded-xl`}>
                      <div className="flex flex-1 items-center">
                        <Avatar image={contact.profileImage} name={contact.name} size={20} />
                        <div className="flex-1 p-2  text-white bg-transparent flex flex-col items-start">
                            <span className="bg-transparent ">{contact.name}</span>
                            <span className="text-xs bg-transparent ">{contact.email}</span>
                        </div>
                      </div>
                      {selectedContacts.includes(contact) && <div className="absolute z-30  right-4 text-blue-500 rounded-full">
                        <CheckCircle2Icon/>
                      </div>}
                  </Button>
              ))}
          </div>
          <div className="w-full p-1 flex gap-2 basis-[100px] items-center">
            <div className="flex-1 text-sm overflow-y-scroll" >
              {selectedContacts.map((contact , index) =>  contact.name + " , ")}
            </div>
            <Button onClick={() => handleSendForwardMessage()} sx={{borderRadius : "50%"}} className='rounded-full w-20 h-20'>
              <SendHorizonal className='' size={30}/>
            </Button>
          </div>
      </div>

    </div>
  )
}

export default ForwardBar