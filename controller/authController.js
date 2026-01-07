import User from "../models/userModel.js";
import bcrypt from  'bcrypt';
import {sendVerificationCode} from "../middleware/emailConfig.js";
import {generateAccessToken,generateRefreshToken} from "../utills/tokenGenerator.js";

export const signup = async (req,res) =>{
    try{
        const {name , email , password} = req.body || {};

        if(!name || !email || !password){
            return res.status(422).json({success: false , message :"All fields required"});
        }
        const userExists = await User.findOne({email:email});
        if(userExists){
            return res.status(200).json({success: true,message: "User Already Exists."});
        }
        const hashPassword = await bcrypt.hash(password , 10);
        const verificationCode = Math.floor(100000 + Math.random() *900000).toString();
        const expiryTime = new Date(Date.now() + 10 * 60 * 1000);
        //date now current time then 10 minute ko second me convert then millsecond me convert
        //new date ek object h timetamp ko date object bna deta h 10.00 Am
        const user = new User({
            name , email , password : hashPassword ,verificationCode ,verificationCodeExpiry :expiryTime
        });
        await user.save();
        sendVerificationCode(user.email , verificationCode);
        return res.status(200).json({success: true, message: "Please verify your email using the OTP sent to your registered email address."});
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
        if(!user.isVerified){
            return res.status(401).json({success :false , message : "Verify Email first"})
        }
        const isMatchPassword = await bcrypt.compare(password, user.password);
        if(!isMatchPassword){
            return res.status(401).json({success : false , message : "Invalid credentials"});
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        
        user.refreshToken = refreshToken;
        await user.save();

        return res.status(200).json({success :true , message :`Welcome ${user.name}` ,accessToken :accessToken ,refreshToken});

    }
    catch(err){
        console.log(err);
        return res.status(500).json({success :false  , message : err.message});
    }
}

export const verifyEmail = async(req,res)=>{
    try{
      const {email ,otp } = req.body;
      if(!email || !otp ){
        return res.status(422).json({success: false , message : "Email and Otp required"})
      }
      const user = await User.findOne({email});
      if(!user){
        return res.status(400).json({success: false , message :"User not found"});
      }
      if(user.isVerified){
         return res.status(400).json({success : false , message :"Email already verified"});
      }
      if(user.verificationCode !== otp){
         return res.status(401).json({success: false , message : "Invalid OTP"});
      }

      if(Date.now > user.verificationCodeExpiry){
            return res.status(400).json({success : false , message : "OTP expired"});
      }

      user.isVerified = true;
      user.verificationCode = null;
      user.verificationCodeExpiry = null;
      
      await user.save();
      return res.status(200).json({success: true , message : "Email verified successfully"});
      

    }
    catch(error){
        console.log(error);
        return res.status(500).json({success: false , message : error.message});
    }
}

export const resendOtp = async(req,res)=>{
    try{
         const {email} = req.body || {};
         if(!email){
            return res.status(400).json({success :false , message : `Email is required`});
         }
         const user = await User.findOne({email});
         if(!user){
            return res.status(404).json({success :false , message : `User not found`});
         }
         if(user.isVerified){
            return res.status(400).json({success : false , message : `Email already verified Please login`})
         }
         if (user.verificationCodeExpiry && user.verificationCodeExpiry > Date.now()) {
            return res.status(400).json({success: false, message: "Please wait for old OTP to expire" });
         }

        const verificationCode = Math.floor(100000 + Math.random() *900000).toString();

        sendVerificationCode(user.email , verificationCode);
        user.isVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpiry = null;
        await user.save();
        return res.status(200).json({success: true, message: "New OTP sent to your email"});

    }
    catch(error){
        console.log(error);
        return res.status(500).json({success : false , message : `Something went wrong ${error.message}`})
    }
}