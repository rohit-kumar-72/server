import ApiError from './../utils/ApiError.js';

const isAdmin = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            throw new ApiError(400, "protected route")
        }
        next();
    } catch (error) {
        return res
            .status(error?.statusCode || 500)
            .json(new ApiResponse(false, error?.statusCode || 500, error?.message))
    }
}

export default isAdmin;