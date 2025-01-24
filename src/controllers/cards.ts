import { NextFunction, Request, Response } from 'express';
import {
  FORBIDDEN_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  VALIDATION_ERROR_CODE,
} from '../errors/errors';
import Card from '../models/card';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

export const createCard = (req: any, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send({ data: card }))
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

export const deleteCard = (req: any, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка не найдена' });
      }
      if (card?.owner.toString() !== userId.toString()) {
        return res.status(FORBIDDEN_ERROR_CODE).send({ message: 'У вас нет прав на удаление этой карточки' });
      }
      return res.send({ data: card });
    })
    .catch(next);
};

export const likeCard = (req: any, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Карточка не найдена' });
      }
      return res.send({ data: card });
    })
    .catch(next);
};

export const dislikeCard = (req: any, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Карточка не найдена' });
      }
      return res.send({ data: card });
    })
    .catch(next);
};
