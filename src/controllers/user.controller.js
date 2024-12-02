import { asyncHandler } from "../utils/aysncHandler.js";
import ApiError from "../utils/apiError.js";
import { uploadCloudinary } from "../utils/coludinary.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { upload } from "../middlewares/multer.middleware.js"




const generateAccessandRefreshToken = async (userid) => {
    try {
        const user = await User.findById(userid)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while maing the token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    //get users details from frontend
    //validation -not empty
    //already resgiterd or not -check with username and email
    // check files are provided or not -avatar 
    //upload then to cloudinary,avatr checking either uploaded on cloudinary or not
    //create user object - create user entreis in db
    //remove password and refreshtoken from resposne
    //check fro user creation and create a response


    const { email, username, fullname, password } = req.body;
    console.log(email, username, fullname, password)

    if ([fullname, email, username, password]
        .some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fileds are rrequired");
    }


    // user present or not
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "email or username is already existed")
    }

    const avtarLocalPath = req.files?.avtar[0]?.path;
    console.log('Avatar File Path:', avtarLocalPath)
    const coverImagePath = req.files?.coverimage?.[0]?.path || null

    if (!avtarLocalPath) {
        throw new ApiError(400, "Avtar file is required")
    }

    const coverimage = coverImagePath
        ? await uploadCloudinary(coverImagePath).catch(() => null)
        : null;

    const avtar = await uploadCloudinary(avtarLocalPath);
    if (!avtar) {
        throw new ApiError(500, "Failed to upload avatar to Cloudinary");
    }


    const user = await User.create({
        fullname,
        avtar: avtar?.url,  // Use the URL from Cloudinary response
        coverimage: coverimage?.url || "", // Cover image URL if available
        email,
        password,
        username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshtoken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while resgitering the user please check your email or username");

    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User resgisterd successfully")
    )

});

const loginUser = asyncHandler(async (req, res) => {
    // req.body --> data
    // username or email data 
    // find user is registered or not 
    // if present check password and see its correct or not 
    // if correct then share the access token and refresh token for user 
    // send through secure cookies and a response to a user that he/she succesfully logedin

    const { email, username, password } = req.body;
    console.log(email)

    if (!username && !email) {
        throw new ApiError(400, "Please make sure you have given corrected email || username");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "The user or email is not existed. Use the register email  or user name")
    }

    const isPasswordvalid = await user.isPasswordCorrect(password)

    if (!isPasswordvalid) {
        throw new ApiError(401, "password is not valid")
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id)

    const loggedinUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //secure sharing of cookies
    const option = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accesstoken", accessToken, option)
        .cookie("refreshToekn", refreshToken, option)
        .json(
            new ApiResponse(200, {
                user: loggedinUser, refreshToken, accessToken
            }, "userloggedint successfully")
        )

});

const logOutUser = asyncHandler(async (req, res) => {
    //clear cookies
    //clear accesstoken and refreshtoken
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined,

        }
    }, {
        new: true
    })

    const option = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(
            new ApiResponse(200, {}, "User logged Out")
        )


})


const refreshAccessToken = asyncHandler(async (req,res)=>{
    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorised request")
    }

    try {
        const decodedToken =jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET )
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401," Invalid referesh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(400,"refresh token is used or expierd");
            
        }
    
    
       const {accessToken,newrefreshToken} = await generateAccessandRefreshToken(user._id)
    
        const option = {
            httpOnly: true,
            secure: true
        }
    
        return res.status(200)
        .cookie("accessToken",accessToken, option)
        .cookie("refreshToken",newrefreshToken, option)
        .json(
            new ApiResponse(200,{accessToken, newrefreshToken},
                "access token refreshed succesfully")
        )
    } catch (error) {
        throw new ApiError(401, error?.message||" invalid refresh token")
    }

})


export { registerUser, loginUser, logOutUser, refreshAccessToken};
