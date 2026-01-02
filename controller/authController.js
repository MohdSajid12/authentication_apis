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
        // CASE 1 - if user is already verified
        if(userExists){
            if(userExists.isVerified){
                return res.status(409).json({success : false , message: "User already exists. Please login."})
            }
            //not verified
            const now = Date.now();
            if(now < userExists.verificationCodeExpiry ){
                  return res.status(200).json({success :false , message : "Otp already sent , Please verify your email"})
            }
             var newotp = Math.floor(100000 + Math.random() *900000).toString();
             var newExpiry  = new Date(Date.now() + 10 * 60 * 1000);

             userExists.verificationCode = newotp;
             userExists.verificationCodeExpiry = newExpiry;

             await userExists.save();
             sendVerificationCode(userExists.email, newOtp);

            return res.status(200).json({success: true,message: "New OTP sent to your email."});
        }

       //CASE-2 : New user signup
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

        return res.status(200).json({success :true , message :`Welcome ${user.name}` ,accessToken :accessToken ,refreshToken :refreshToken});

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