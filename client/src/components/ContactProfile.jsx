import React, { useState } from 'react'
import { buttons } from '../utils'
import {motion} from "framer-motion"
function ContactProfile({user}) {
    const [section , setSection] = useState(1)



    
  const getSection = (section) => {
    switch(section) {
      case 1 : return (
        <div className="w-full h-full overflow-y-scroll flex flex-col items-center gap-4">
            <div className="rounded-full h-24 w-24 mt-7 object-cover bg-center overflow-hidden ">
              <img src={`data:image/jpeg;base64,${user.profileImage}`} className='h-full w-full'  />
            </div>
            <span className="text-sm text-zinc-300 uppercase tracking-[3px]"> - {user.name}</span>

        </div>
      )
    }
  }
  return (
    <div className='flex w-full bg-zinc-800 h-full'>
        <div className="options  flex flex-col p-4 px-6 gap-7 border-r border-zinc-700">
          {
            buttons.map((button , index) => (
              <button key={index} onClick={() => setSection(button.id)} className={` px-3 py-1  cursor-pointer flex gap-3 text-xs   shadow-xl  capitalize tracking-[5px] transition duration-300  ${section == button.id ? 'border-l-[1.2px] border-blue-400 scale-105 rounded-sm bg-zinc-600 ' : ''}`}> <button.Icon size={10}/> {button.name}</button>
            ))
          }
        </div>
        <div className="section  flex-1">
          {getSection(section)}
        </div>
    </div>
  )
}

export default ContactProfile;

