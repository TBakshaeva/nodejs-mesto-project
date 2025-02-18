import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import NotFoundError from '../errors/not-found-error';
import ConflictError from '../errors/conflict-error';
import UnauthorizedError from '../errors/unauthorized-error';
import ValidationError from '../errors/validation-error';

const SALT_ROUNDS = 10;

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find({});
    res.send({ data: users });
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id);
    res.send({ data: user });
  } catch (err) {
    next(err);
  }
};

export const getUsersById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).orFail(
      new NotFoundError('Пользователь не найден'),
    );
    res.send({ data: user });
  } catch (err: any) {
    if (err.name === 'CastError') {
      next(new ValidationError(err.message));
    } else {
      next(err);
    }
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });

    res.send({ data: newUser });
  } catch (err: any) {
    if (err.code === 11000) {
      next(new ConflictError('Пользователь с таким email уже существует'));
    } else if (err.name === 'ValidationError') {
      next(new ValidationError(err.message));
    } else {
      next(err);
    }
  }
};

export const updateUser = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const { name, about } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );

    res.send({ data: updatedUser });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      next(new ValidationError(err.message));
    } else {
      next(err);
    }
  }
};

export const updateUserAvatar = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;

  try {
    const updatedAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );

    res.send({ data: updatedAvatar });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      next(new ValidationError(err.message));
    } else {
      next(err);
    }
  }
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', {
          expiresIn: '7d',
        }),
      });
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
};
