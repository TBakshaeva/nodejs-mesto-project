import express from 'express';
import {
  getUsers, getUsersById, createUser, updateUser, updateUserAvatar,
} from '../controllers/users';

const router = express.Router();

router.get('/', getUsers);
router.get('/:userId', getUsersById);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

export default router;
