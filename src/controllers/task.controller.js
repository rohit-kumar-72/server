import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            dueDate,
            priority
        } = req.body;

        const userId = req.user.id;
        if (!userId) {
            throw new ApiError(400, "invalid user please login.")
        }

        if (!title || !description || !dueDate || !priority) {
            throw new ApiError(400, "please provide all required details.");
        }

        const task = await Task.create({
            title,
            description,
            dueDate,
            priority,
            createdBy: userId
        });

        if (!task) {
            throw new ApiError(500, "server issue while creating Task.")
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                $push: {
                    taskCreated: task._id
                }
            }
        );

        if (!user) {
            throw new ApiError(500, "server issue while assigning owner of task.")
        }

        return res
            .status(200)
            .json(new ApiResponse(true, 201, "Task created successfully", { ...task, creator: user.fullname }))

    } catch (error) {
        return res
            .status(error.statusCode)
            .json(new ApiResponse(false, error.statusCode, error.message))
    }
}

export const allTask = async (req, res) => {
    try {
        const task = await Task.find().populate([
            { path: 'assignedUser', select: 'username fullname email' },
            { path: 'createdBy', select: 'username fullname email' }
        ]).exec();
        return res
            .status(200)
            .json(new ApiResponse(true, 201, "all task fetched successfully", task))
    } catch (error) {
        return res
            .status(error?.statusCode || 500)
            .json(new ApiResponse(false, error?.statusCode || 500, error?.message))
    }
}

export const userAllTask = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            throw new ApiError(400, "invalid user");
        }

        const allCreatedTask = await Task.find({ createdBy: userId }).populate("createdBy").exec();

        const allAssignedTask = await Task.find({ assignedUser: userId }).populate("createdBy").exec();

        return res
            .status(200)
            .json(new ApiResponse(true, 201, "user task fetched successfully", { allCreatedTask, allAssignedTask }))

    } catch (error) {
        return res
            .status(error?.statusCode || 500)
            .json(new ApiResponse(false, error?.statusCode || 500, error?.message))
    }
}

// update task
export const updateTask = async (req, res) => {
    try {
        const taskId = req.body.taskId;
        const { updates } = req.body;

        let validUpdates = {};

        for (let key in updates) {
            if (updates[key] !== null && updates[key] !== undefined) {
                validUpdates[key] = updates[key]
            }
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            validUpdates,
            {
                new: true,
                runValidators: true
            }
        )

        if (!updateTask) {
            throw new ApiError(500, "unable to update task")
        }

        return res
            .status(200)
            .json(new ApiResponse(true, 201, "task updated successful", updatedTask))

    } catch (error) {
        return res
            .status(error?.statusCode || 500)
            .json(new ApiResponse(false, error?.statusCode || 500, error?.message))
    }
}

export const deleteTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.body.taskId;

        if (!userId) {
            throw new ApiError(400, "invalid user.")
        }
        if (!taskId) {
            throw new ApiError(400, "please provide task id.")
        }

        const user = await User.findOne({ _id: userId });

        let taskCreatorId;
        if (!user.isAdmin) {
            taskCreatorId = userId;
        } else {
            const task = await Task.findOne({ _id: taskId });
            taskCreatorId = task.createdBy;
        }

        await User.findByIdAndUpdate(
            taskCreatorId,
            {
                $pull: {
                    taskCreated: taskId
                }
            }
        )

        await Task.findByIdAndDelete(taskId);

        return res
            .status(200)
            .json(new ApiResponse(true, 201, "task deleted successfully."))
    } catch (error) {
        return res
            .status(error?.statusCode || 500)
            .json(new ApiResponse(false, error?.statusCode || 500, error?.message))
    }
}