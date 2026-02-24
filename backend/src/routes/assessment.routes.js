import express from 'express';
import { body } from 'express-validator';
import firebaseAuth from '../middleware/firebaseAuth.middleware.js';
import { startAssessment, submitAssessment, getAssessment } from '../controllers/assessment.controller.js';

const router = express.Router();

router.post('/start', firebaseAuth, startAssessment);

router.post(
  '/submit',
  firebaseAuth,
  [
    body('logicalScore').isFloat({ min: 0, max: 100 }).withMessage('logicalScore must be 0–100'),
    body('creativeScore').isFloat({ min: 0, max: 100 }).withMessage('creativeScore must be 0–100'),
    body('verbalScore').isFloat({ min: 0, max: 100 }).withMessage('verbalScore must be 0–100'),
    body('interestTags').isArray().withMessage('interestTags must be an array'),
  ],
  submitAssessment
);

router.get('/:userId', firebaseAuth, getAssessment);

export default router;
