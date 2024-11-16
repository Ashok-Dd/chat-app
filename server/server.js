import http from 'http';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import AuthRouter from "./routes/AuthRoutes.js"
import ContactsRouter from "./routes/contactRoutes.js"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser';
import { setUpSocket } from './socket.js';
const app = express();
dotenv.config();
const server = http.createServer(app);
app.use(cors({
    origin : "http://localhost:5173" , credentials : true
}));

app.use(express.json());
app.use(cookieParser())



app.use('/api/auth' ,AuthRouter  )
app.use('/api/contacts' , ContactsRouter)



server.listen(9000, () => {
    console.log("Server running at port 9000");
});

mongoose.connect("mongodb+srv://bunnyking828:sGfTbvMWAc1cKK7t@cluster0.qcx5r.mongodb.net/chat")
.then(() => console.log("Connected to mongodb"))
.catch((e) => console.log("failed to connect mongodb"))

setUpSocket(server)

