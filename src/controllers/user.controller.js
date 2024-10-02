import { User } from "../models/user.model.js";
import ApiResponse from './../utils/ApiResponse.js';

export const fetchAllUser = async (req, res) => {
    try {
        const user = await User.find();
        return res
            .status(200)
            .json(new ApiResponse(true, 201, "all user fetched successfully", user))
    } catch (error) {
        return res
            .status(error?.statusCode || 500)
            .json(new ApiResponse(false, error?.statusCode || 500, error?.message))
    }
}