import express from 'express';
import { body } from 'express-validator';
import authMiddleware from '../middleware/auth.middleware.js';
import { processChat } from '../controllers/chat.controller.js';

const router = express.Router();

router.post(
  '/process',
  authMiddleware,
  [body('message').notEmpty().withMessage('message is required').trim()],
  processChat
);

export default router;
