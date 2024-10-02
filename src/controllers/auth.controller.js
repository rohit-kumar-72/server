import { User } from '../models/user.model.js';
import ApiError from './../utils/ApiError.js';
import { Otp } from './../models/otp.model.js';
import ApiResponse from './../utils/ApiResponse.js';

export const registerUser = async (req, res) => {

    // get user details
    // validate details - not empty
    // password == confirmpassword
    // check already present -> username,email
    // validate otp 
    // create user 
    // remove password and token
    // send response
    try {
        const {
            username,
            email,
            fullname,
            password,
            confirmPassword,
            otp,
            isAdmin
        } = req.body;

        if (!username || !email || !fullname || !password || !confirmPassword) {
            throw new ApiError(400, "All fields are required.")
        }

        if (password != confirmPassword) {
            throw new ApiError(401, "password not matching.")
        }

        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (existedUser) {
            throw new ApiError(409, "user with email or username already exist")
        }

        // const savedOtp = await Otp.findOne({ email });
        // if (!savedOtp || savedOtp.code != otp) {
        //     throw new ApiError(400, "Incorrect OTP.")
        // }

        const userDetails = {
            username, email, fullname, password
        }

        if (isAdmin) {
            userDetails.isAdmin = true;
        }

        const newUser = await User.create(userDetails)

        if (!newUser) {
            throw new ApiError(300, "error while creating user.")
        }

        newUser.password = null;

        return res
            .status(200)
            .json(new ApiResponse(true, 200, "user registered successfully", newUser))

    } catch (error) {
        return res
            .status(error?.statusCode)
            .json(new ApiResponse(false, error?.statusCode, error.message))
    }
}

export const loginUser = async (req, res) => {

    // get data from user 
    // check for user exist or not
    // check password
    // generate token 
    // save token to db and send it to user

    try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            throw new ApiError(400, "All fields are mandatory.")
        }

        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        });

        if (!user) {
            throw new ApiError(400, "no user found. please register")
        }

        const isValidPassword = await user.isCorrectPassword(password);

        if (!isValidPassword) {
            throw new ApiError(400, "Incorrect username or password")
        }

        const token = await user.generateToken();
        if (!token) {
            throw new ApiError(500, "unable to create token for you.")
        }

        user.token = token;
        await user.save({ validateBeforeSave: false }); // whenever we save any document then we need to pass all required field data but we are not passing any data so we used validateBeforeSave as false.

        user.password = null;
        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("token", token, options)
            .json(new ApiResponse(true, 200, "login successful", { user, token: token }))

    } catch (error) {
        return res
            .status(500)
            .json(new ApiResponse(false, 500, error?.message))
    }
}

export const logoutUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByIdAndUpdate(
            { _id: userId },
            {
                $set: {
                    token: null,
                }
            },
            {
                new: true,
            }
        ).select("-password")

        const options = {
            httpOnly: true,
            secure: true
        }

        return await res
            .status(200)
            .clearCookie("token", options)
            .json(new ApiResponse(true, 200, "logout successfully"))
    } catch (error) {
        return res
            .status(error.statusCode)
            .json(new ApiResponse(false, error.statusCode, error.message))
    }
}