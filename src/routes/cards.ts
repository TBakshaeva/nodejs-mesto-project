import express from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/cards';

const router = express.Router();

router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required(),
    owner: Joi.string().required(),
  }).unknown(true),
}), createCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

export default router;
