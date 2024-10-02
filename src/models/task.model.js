import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["To Do", "In Progress", "Completed"],
        default: "To Do"
    },
    assignedUser: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"]
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export const Task = mongoose.model("Task", taskSchema);