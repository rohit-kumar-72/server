import { Router } from 'express';
import isLoggedIn from '../middlewares/isLoggedIn.js';
import isAdmin from '../middlewares/isAdmin.js';
import { fetchAllUser } from '../controllers/user.controller.js';

const router = Router();

router.route("/all-user").post(isLoggedIn, isAdmin, fetchAllUser)

export default router;