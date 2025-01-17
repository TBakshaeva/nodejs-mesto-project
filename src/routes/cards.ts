import express from 'express';
import {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/cards';

const router = express.Router();

router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.post('/', createCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

export default router;
