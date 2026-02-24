import express from 'express';
import { body } from 'express-validator';
import firebaseAuth from '../middleware/firebaseAuth.middleware.js';
import { processVoice } from '../controllers/voice.controller.js';

const router = express.Router();

router.post(
  '/process',
  firebaseAuth,
  [body('speechText').notEmpty().withMessage('speechText is required').trim()],
  processVoice
);

export default router;
