import { User } from '../models/user.model.js';
import ApiError from './../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import ApiResponse from './../utils/ApiResponse.js';

const isLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies?.token ||
            req.body.token ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(400, "no token found");
        }

        const payload = jwt.verify(token, process.env.TOKEN_SECRET);

        if (!payload) {
            throw new ApiError(400, "invalid token");
        }

        const user = await User.findById(payload.id).select("-password -token");
        if (!user) {
            throw new ApiError(500, "no user found try to login first");
        }

        req.user = user;
        next();
    } catch (error) {
        return res
            .status(error?.statusCode || 500)
            .json(new ApiResponse(false, error?.statusCode || 500, error?.message))
    }
}

export default isLoggedIn;