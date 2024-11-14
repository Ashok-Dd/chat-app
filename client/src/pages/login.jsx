import { useState } from 'react'
import image from "../assets/5214.jpg"
// import styles from './login.module.css'
import axios from 'axios'
import {toast} from "react-toastify"
import { useStore } from './store'
import { useNavigate } from 'react-router-dom'
const LoginPage = () => {
    const [section , setSection] = useState(1);
    const colors = [
        'text-[#FF6B6B]', // Soft red
        'text-[#FFD93D]', // Warm yellow
        'text-[#6BCB77]', // Light green
        'text-[#4D96FF]', // Calm blue
        'text-[#F0A6CA]', // Soft pink
        'text-[#9B5DE5]', // Purple
        'text-[#00BBF9]', // Light cyan
        'text-[#FFD166]', // Soft orange
        'text-[#06D6A0]', // Mint green
        'text-[#EF476F]', // Coral pink
        'text-[#118AB2]', // Ocean blue
        'text-[#073B4C]', // Deep blue
      ];
      
    const navigate = useNavigate();
    const [name , setName] = useState('')
    const [email , setEmail] = useState('')
    const [password , setPassword] = useState('')
    const {setUserInfo} = useStore() 
    const [loading , setLoading] = useState(false);


    const handleLogin = async(e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post("http://localhost:9000/api/auth/login", {email , password} , {withCredentials : true} );

            console.log(response);
            
            if(response.status === 400 || response.status === 500) {
                 throw new Error(response.data.message)
            }
    
            const data = response.data
            setUserInfo(data.user)
            setLoading(false);
            toast.success(data.message);
            navigate("/chat")
        } catch (error) {
            toast.error(error.message);
            setLoading(false);
        }
    }
    

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:9000/api/auth/signup" , { email , password , name} , {withCredentials : true})


            if(response.status === 400 || response.status === 500) {
                throw new Error(response.data.message)
            }
            const data = response.data 
            setUserInfo(data.user)
            toast.success(data.message);
            navigate('/chat')
        } catch (error) {
            toast.error(error.message);
        }
    }
    return (
        <>
            <div className={'flex items-center justify-center  bg-gray-200 h-screen w-full '}>
                <div className="mx-auto bg-white shadow-lg flex-1 rounded-xl w-full max-w-[1000px] max-h-[600px]  h-full grid grid-cols-1 md:grid-cols-2">
                    <div className='flex  flex-col gap-3 '>
                        <div className='heading text-center py-10'>
                            <h1 className='font-black text-4xl tracking-wider'>WELCOME TO</h1>
                            <h3 className=''>
                                {['c' , 'h' , 'a' , 't' ,' ' , 'a' , 'p' , 'p'].map((word , index) => {
                                    return (
                                        <span key={index} className={`${colors[Math.floor(Math.random() * colors.length + 1)]} text-2xl uppercase tracking-wider font-semibold`}>{word}</span>
                                    )
                                } )}
                            </h3>
                        </div>
                        <div className="flex-1 flex flex-col gap-10">
                            <div className='sections  grid grid-cols-2 p-5'>
                                <button onClick={() => setSection(1)} className={`capitalize py-2  font-semibold ${section == 1 ? 'bg-white border-b-[2px] border-b-blue-500 ' : 'bg-gray-50'}`}>login</button>
                                <button onClick={() => setSection(2)} className={`capitalize py-2  font-semibold ${section == 2 ? 'bg-white border-b-[2px] border-b-blue-500 ' : 'bg-gray-50'}`}> sign up</button>
                            </div>
                            <div className='flex  items-center justify-center  '>
                                {section == 1 ? (
                                    <form className='flex flex-col gap-3 w-full px-7 gap-7' onSubmit={handleLogin}>
                                        <input className='outline-none  px-4 py-2 text-xl border border-gray-400 focus:border-black focus:border-[2px] rounded-full ' type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} required/>
                                        <input className='outline-none  px-4 py-2 text-xl border border-gray-400 focus:border-black focus:border-[2px] rounded-full ' type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} required/>
                                        <button className='bg-blue-500 rounded-full text-white text-xl capitalize  flex items-center py-2 justify-center font-bold'  type='submit'>
                                            {loading ? <div className='rounded-full border-[3px] border-white border-t-blue-700 w-7   h-7    animate-spin'/> : "login"}
                                        </button>
                                    </form>
                                ) : (
                                <form className='flex flex-col gap-3 w-full px-7 gap-7' onSubmit={handleSignUp}>
                                    <input className='outline-none  px-4 py-2 text-xl border border-gray-400 focus:border-black focus:border-[2px] rounded-full ' type="text" placeholder='Name' onChange={(e) => setName(e.target.value)} required/>
                                    <input className='outline-none  px-4 py-2 text-xl border border-gray-400 focus:border-black focus:border-[2px] rounded-full ' type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} required/>
                                    <input className='outline-none  px-4 py-2 text-xl border border-gray-400 focus:border-black focus:border-[2px] rounded-full ' type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} required/>
                                    <button className='bg-blue-500 rounded-full text-white text-xl capitalize  flex items-center py-2 justify-center font-bold'  type='submit'>
                                        {loading ?<div className='rounded-full border-[3px] border-white border-t-blue-700 w-7   h-7    animate-spin'/> : "Sign Up"}
                                    </button>
                                </form>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='object-cover hidden md:flex items-center'>
                        <img src={image} alt="chat app" />
                    </div>
                </div>
                
            </div>
        </>
    )
}
export default LoginPage



