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
    profileImage : {
        type : String,
        required : true
    }
} ,{timestamps : true});

const User  = mongoose.model("User" , userModel);
export default User;