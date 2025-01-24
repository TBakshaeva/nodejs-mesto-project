import express, { Response, NextFunction, Request } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
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
app.post('/signup', createUser);

app.use(auth);

app.use('/cards', cardsRouter);
app.use('/users', usersRouter);

app.use(errorLogger);

// eslint-disable-next-line no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(DEFAULT_ERROR_CODE).send({
    message: 'На сервере произошла ошибка',
  });
});

app.listen(PORT);
