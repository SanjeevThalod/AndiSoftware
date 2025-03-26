import express from 'express';
import { getUserProfile, updateUserProfile, getAllUsers, approveUser, rejectUser } from '../controllers/userController.js';
import { checkLogin, checkAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/profile').get(checkLogin, getUserProfile).put(checkLogin, updateUserProfile);
router.route('/').get(checkLogin, checkAdmin, getAllUsers);
router.route('/:id/status').put(checkLogin, checkAdmin, approveUser);
router.route('/:id/reject').put(checkLogin, checkAdmin, rejectUser);

export default router;