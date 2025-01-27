import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import NotFoundError from '../errors/not-found-error';
import ForbiddenError from '../errors/forbidden-error';
import ValidationError from '../errors/validation-error';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    res.send({ data: cards });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      next(new ValidationError(err.message));
    }
    next(err);
  }
};

export const createCard = async (req: any, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  try {
    const newCard = Card.create({ name, link, owner: ownerId });
    res.send({ data: newCard });
  } catch (err) {
    next(err);
  }
};

export const deleteCard = async (req: any, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const card = await Card.findById(cardId).orFail(new NotFoundError('Карточка не найдена'));

    if (card.owner.toString() !== userId.toString()) {
      throw new ForbiddenError('У вас нет прав на удаление этой карточки');
    }

    await Card.findByIdAndDelete(cardId);
    res.send({ data: card });
  } catch (err: any) {
    if (err.name === 'CastError') {
      next(new ValidationError(err.message));
    }
    next(err);
  }
};

export const likeCard = async (req: any, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail(new NotFoundError('Карточка не найдена'));
    res.send({ data: card });
  } catch (err: any) {
    if (err.name === 'CastError') {
      next(new ValidationError(err.message));
    }
    next(err);
  }
};

export const dislikeCard = async (req: any, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail(new NotFoundError('Карточка не найдена'));
    res.send({ data: card });
  } catch (err: any) {
    if (err.name === 'CastError') {
      next(new ValidationError(err.message));
    }
    next(err);
  }
};
