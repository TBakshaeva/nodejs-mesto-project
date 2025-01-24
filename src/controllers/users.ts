import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  CONFLICT_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  UNAUTHORISED_ERROR_CODE,
  VALIDATION_ERROR_CODE,
} from '../errors/errors';
import User from '../models/user';

const SALT_ROUNDS = 10;

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

export const getUser = (req: any, res: Response, next: NextFunction) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch(next);
};

export const getUsersById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hashedPassword) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hashedPassword,
      });
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(VALIDATION_ERROR_CODE)
          .send({ message: 'Некорректные данные' });
      } else if (err.code === 11000) {
        res
          .status(CONFLICT_ERROR_CODE)
          .send({ message: 'Пользователь с таким email уже существует' });
      }
      next(err);
    });
};

export const updateUser = (req: any, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about, avatar }, { new: true })
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(VALIDATION_ERROR_CODE)
          .send({ message: 'Некорректные данные' });
      } else {
        next(err);
      }
    });
};

export const updateUserAvatar = (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(VALIDATION_ERROR_CODE)
          .send({ message: 'Некорректные данные' });
      } else {
        next(err);
      }
    });
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      res.status(UNAUTHORISED_ERROR_CODE).send({ message: err.message });
    });
};
