import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import {BrowserRouter} from "react-router-dom"
import { SocketProvider } from './context/SocketContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <App />
        <ToastContainer/>
      </SocketProvider>
    </BrowserRouter>
  </StrictMode>,
)
