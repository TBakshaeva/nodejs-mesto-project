import express from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUser,
  getUsers, getUsersById, updateUser, updateUserAvatar,
} from '../controllers/users';

const router = express.Router();

router.get('/', getUsers);
router.get('/:userId', getUsersById);
router.get('/me', getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().min(2).max(200).optional(),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/).optional(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/).optional(),
  }),
}), updateUserAvatar);

export default router;
