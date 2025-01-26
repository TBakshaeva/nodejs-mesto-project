import express, { Response, NextFunction, Request } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { celebrate, errors, Joi } from 'celebrate';
import { errorLogger, requestLogger } from './middlewares/logger';
import { createUser, login } from './controllers/users';
import { DEFAULT_ERROR_CODE } from './errors/errors';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import auth from './middlewares/auth';

dotenv.config();

const { PORT } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);

app.post('/signin', login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().min(2).max(200).optional(),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/).optional(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
  }),
}), createUser);

app.use(auth);

app.use('/cards', cardsRouter);
app.use('/users', usersRouter);

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = DEFAULT_ERROR_CODE, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === DEFAULT_ERROR_CODE
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT);
