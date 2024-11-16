import { useEffect, useState } from "react";
import { useStore } from "./store";
import { Delete, Eraser, Trash } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {CircularProgress} from '@mui/material'
const Profile = () => {
    const {userInfo , setUserInfo} = useStore()
    const [profile , setProfile] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [about, setAbout] = useState('');
    const [isBioFocused, setIsBioFocused] = useState(false);
    const [loading , setLoading] = useState(false)
    const navigate = useNavigate();
    useEffect(() => {
        if(userInfo) {
            setProfile(userInfo?.profileImage)
            setInputValue(userInfo?.name)
            setAbout(userInfo?.about)
        }
    }, [userInfo])

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log(file);
        setProfile(file)
    }

    const handleSubmit = async () => {
        setLoading(true);
        const formData = new FormData();

        formData.append("profileImage" , profile);
        formData.append("name" , inputValue);
        formData.append("about" , about);

        try {

            const response = await axios.put('http://localhost:9000/api/auth/update-profile' , formData , {withCredentials : true});

            if(response.data.success) {
                toast.success(response.data.message);
                setUserInfo(response.data.user)
                navigate('/chat');
                setLoading(false);
            }else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
            setLoading(false);
        }
    }

    return (
        <div className="h-screen w-full flex">
            <div className="flex-1 flex p-10">
                <div className="flex flex-col gap-5 w-full">
                    <span className=" text-xl md:text-4xl font-semibold">Set-Up your profile  </span>
                    <div  className="flex flex-col gap-10 pl-5 sm:pl-10 md:pl-20 py-5   w-full h-full ">
                        <div className="flex relative  gap-5 ">
                            <span className=" absolute right-48 tracking-wider  text-gray-200  text-opacity-90 uppercase md:text-xl font-semibold">Upload an image <br /> for your account</span>
                                {!profile ? (
                                    <label
                                        htmlFor="image"
                                        className="flex flex-col items-center justify-center w-48 h-48 lg:w-48 lg:h-48 p-7 border border-dashed border-gray-300 rounded-full cursor-pointer "
                                    >
                                        <div className="text-gray-500 text-center">Upload Image</div>
                                        <input
                                            type="file"
                                            id="image"
                                            name="image"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                    />
                                </label>
                                ) : (
                                    <div className="rounded-full  border w-48 h-48 lg:w-48 lg:h-48 object-cover overflow-hidden flex items-center justify-center">
                                        <img src={typeof profile === "string" ? `data:image/jpeg;base64,${profile}` : URL.createObjectURL(profile)} alt="Image" className="h-full w-full" />
                                    </div>
                                )}

                                <div className="self-end p-1 text-blue-500">
                                    {profile && (
                                        <div className="text-blue-500">
                                            <Trash onClick={() => setProfile(null)} className="cursor-pointer" color="blue"/>
                                        </div>
                                    ) }
                                </div>
                        </div>
                        <div className="flex items-center relative">
                            <span
                                className={`absolute left-2 transform transition-all duration-300 ${
                                isFocused || inputValue ? "-top-3 text-sm text-blue-600" : "top-1/2 -translate-y-1/2 text-xl text-opacity-80"
                                }`}
                            >
                                Your Name
                            </span>
                            <input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                type="text"
                                className="w-full max-w-[500px] border-b-2 bg-transparent focus:border-blue-600 focus:ring-0 py-2 px-3 border-gray-200 outline-none text-2xl"
                            />
                        </div>
                        <div className="flex items-center relative">
                            <span
                                className={`absolute left-2 transform transition-all duration-300 ${
                                isBioFocused || about ? "-top-3 text-sm text-blue-600" : "top-1/2 -translate-y-1/2 text-xl text-opacity-80"
                                }`}
                            >
                                 About
                            </span>
                            <textarea
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                onFocus={() => setIsBioFocused(true)}
                                onBlur={() => setIsBioFocused(false)}
                                className="w-full max-w-[500px] border-b-2 bg-transparent focus:border-blue-600 focus:ring-0 py-2 px-3 border-gray-200 outline-none text-2xl"
                            />
                        </div>
                        <div className="w-full py-5 flex items-center justify-end gap-10 max-w-[70%]">
                            { loading &&  <CircularProgress size={25}/>}
                            <button onClick={() => handleSubmit()}  disabled={loading}  className="btn">Set-Up Profile</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-full hidden xl:block basis-[350px] object-cover bg-gradient-to-b from-[hsla(222,100%,68%,1)] via-[hsla(336,87%,61%,1)] to-[hsla(262,81%,71%,1)]"/>
        </div>
    )
        
}

export default Profile;