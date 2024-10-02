import { Router } from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/auth.controller.js';
import isLoggedIn from './../middlewares/isLoggedIn.js';

const router = Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(isLoggedIn, logoutUser)

export default router;