import jwt from 'jsonwebtoken';

export const generateAccessToken = (user)=>
      jwt.sign({_id :user._id} ,process.env.ACCESS_SECRET ,{expiresIn : '15m'})


export const generateRefreshToken = (user) =>
    jwt.sign({_id:user._id} ,process.env.ACCESS_REFRESH ,{expiresIn :"7d"});
