import { asyncHandler } from "../utils/aysncHandler.js";
import ApiError from "../utils/apiError.js";
import {User} from "../modles/user.model.js";
import {uploadCloudinary} from "../utils/coludinary.js"
import {ApiResponse} from "../utils/apiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
  //get users details from frontend
  //validation -not empty
  //already resgiterd or not -check with username and email
  // check files are provided or not -avatar 
  //upload then to cloudinary,avatr checking either uploaded on cloudinary or not
  //create user object - create user entreis in db
  //remove password and refreshtoken from resposne
  //check fro user creation and create a response

 const {email,username,fullname,password} = req.body;
 console.log(email,username,fullname,password)

if ([fullname,email,username,password]
    .some((field)=> field?.trim()=== "")) {
        throw new ApiError(400,"All fileds are rrequired");
}


// user present or not
const existedUser = User.findOne({
    $or: [{ username },{ email }]
})

if(existedUser){
    throw new ApiError(409,"emial or username is already existed")
}

const avtarLocalPath = req.files?.avtar[0]?.path;
const coverImagePath = req.files?.coverimage[0]?.path;

if(!avtarLocalPath){
    throw new ApiError(400, "Avtar file is required")
}

const avtar = await uploadCloudinary(avtarLocalPath)
const coverimage = await uploadCloudinary(coverImagePath)

if(!avtar){
    throw new ApiError(400, "Avtar file is required")
}

const user = await User.create({
    fullname,
    avtar: avtar.url,
    coverimage: coverimage?.url || "",
    email,
    password,
    username:username.toLowerCase()
})

const createdUser = await User.findById(user._id).select(
    "-password -refreshtoken"
)

if(!createdUser){
    throw new ApiError(500,"Something went wrong while resgitering the user please check your email or username");
    
}

return res.status(201).json(
    new ApiResponse(200,createdUser,"User resgisterd successfully")
)

});

export { registerUser };
