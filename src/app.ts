import express, { Response, NextFunction, Request } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { DEFAULT_ERROR_CODE } from './errors/errors';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';

dotenv.config();

const { PORT } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req: any, res: Response, next: NextFunction) => {
  req.user = {
    _id: '6783d92ce192b9dc1ca43b3a',
  };

  next();
});

app.use('/cards', cardsRouter);
app.use('/users', usersRouter);

// eslint-disable-next-line no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(DEFAULT_ERROR_CODE).send({
    message: 'На сервере произошла ошибка',
  });
});

app.listen(PORT);
