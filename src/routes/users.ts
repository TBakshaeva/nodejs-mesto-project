import express from 'express';
import {
  getUser,
  getUsers, getUsersById, updateUser, updateUserAvatar,
} from '../controllers/users';

const router = express.Router();

router.get('/', getUsers);
router.get('/:userId', getUsersById);
router.get('/me', getUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

export default router;
