import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/aysncHandler.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config({path:'./.env'});

export const verifyJwt = asyncHandler(async (req, _, next)=>
   {
      try 
     {
 
  const token = await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
  console.log("headers",req.header)
  console.log("cookies",req.cookies)
  console.log(token)
 
  if(!token){
     throw new ApiError(401,"Unauthoried request")
  }
 
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,)
 
  const user  = await User.findById(decodedToken?._id).select("-password -refreshToken")
 
  if(!user){
     throw new ApiError(401,"Invalid access token");
  }
 
 req.user = user;
 next()
   } catch (error) {
     throw new ApiError(401,error?.message || "Invalid access");
     
   }

})