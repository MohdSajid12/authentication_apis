import User from "../models/userModel.js";
import bcrypt from  'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req,res) =>{
    try{
        const {name , email , password} = req.body || {};

        if(!name || !email || !password){
            return res.status(422).json({success: false , message :"All fields required"});
        }
        const userExists = await User.findOne({email:email});
        if(userExists){
           return res.status(409).json({success : false , message : "User Already exists"});
        }
        const hashPassword = await bcrypt.hash(password , 10);
        const user = new User({
            name , email , password : hashPassword
        });
        await user.save();
        return res.status(200).json({success: true , message : "User Registered successfully"});
    }
    catch(err){
       console.log(err);
       return res.status(500).json({success : false , message : err.message})
    }
}

export const login = async (req,res) =>{
    try{
        const {email , password} = req.body || {};
        if(!email  || !password){
            return res.status(422).json({success: false , message : "All field required"});
        }
        const user = await User.findOne({email :email});
        if(!user){
            return res.status(404).json({success : false , message : "User not found"});
        }
        const isMatchPassword = await bcrypt.compare(password, user.password);
        if(!isMatchPassword){
            return res.status(401).json({success : false , message : "Invalid credentials"});
        }
        const token=  jwt.sign({_id : user.id} ,process.env.JWT , {expiresIn :'1d'});
        return res.status(200).json({success :true , message :`Welcome ${user.name}`});

    }
    catch(err){
        console.log(err);
        return res.status(500).json({success :false  , message : err.message});
    }
}