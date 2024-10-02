import { Router } from 'express';
import isLoggedIn from '../middlewares/isLoggedIn.js';
import { allTask, createTask, deleteTask, updateTask, userAllTask } from '../controllers/task.controller.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = Router();

router.route("/create-task").post(isLoggedIn, createTask)
router.route("/user-all-task").post(isLoggedIn, userAllTask)
router.route("/update-task").put(isLoggedIn, updateTask)
router.route("/delete-task").delete(isLoggedIn, deleteTask)
router.route("/all-task").post(isLoggedIn, isAdmin, allTask)

export default router;