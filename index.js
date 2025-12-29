import express from 'express';
import dotenv from "dotenv";
import dbConnect from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import multer from 'multer';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json()); //yh json me ane wale data ko parse krke req.body me dalta h
app.use(express.urlencoded({extended :false})) //this is middleware form data ko parse krne me help
// krta h jo hum form data se data send krte h

app.use("/auth" , authRoutes);

app.listen(PORT ,()=>{
    console.log(`server is running on the port ${PORT}`);
    dbConnect();
})