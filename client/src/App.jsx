import Chat from "./pages/Chat";
import LoginPage from "./pages/login";
import {Routes , Route, Navigate} from "react-router-dom"
import { useStore } from "./pages/store";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Profile from "./pages/Profile";

const PrivateRoute = ({children}) => {
  const {userInfo} = useStore();
  return !!userInfo ? children : <Navigate to={"/login"}/> 
}
const AuthRoute = ({children}) => {
  const {userInfo} = useStore();
  return !!userInfo ? <Navigate to={"/chat"} /> : children 
}



function App(){
  
  const {userInfo , setUserInfo} = useStore();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/auth/check-auth", {
          credentials: 'include',
        });

        if(response.ok) {
          const data = await response.json();
          setUserInfo(data.user);
        }
        
      } catch (error) {
        console.error(error);
      }
    };
    
    if(!userInfo) {
      getUserInfo();
    }
  } , [userInfo , setUserInfo])
    return (
      <>
        <Routes>
          <Route path="/login" element={ <AuthRoute><LoginPage/></AuthRoute> }/>
          <Route path="/chat" element={<PrivateRoute><Chat/> </PrivateRoute> }/>
          <Route path="/" element={<PrivateRoute><Chat/></PrivateRoute>}/>
          <Route path="/profile" element={<Profile/>}/>
        </Routes>
      </>
    )
}
export default App;