import mongoose, { trusted } from "mongoose";

const userModel = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true
    },
    password  : {
        type : String,
        required : true 
    },
    isVerified : {
         type :Boolean,
         default : false
    },
    verificationCode:{
        type : String
    },
    verificationCodeExpiry: {
       type: Date
    },
} ,{timestamps : true});

const User  = mongoose.model("User" , userModel);
export default User;