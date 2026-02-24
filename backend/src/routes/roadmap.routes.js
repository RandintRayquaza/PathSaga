import express from 'express';
import { body } from 'express-validator';
import firebaseAuth from '../middleware/firebaseAuth.middleware.js';
import { generateRoadmap, getRoadmap, updateProgress } from '../controllers/roadmap.controller.js';

const router = express.Router();

router.post(
  '/generate',
  firebaseAuth,
  [body('careerGoal').notEmpty().withMessage('careerGoal is required')],
  generateRoadmap
);

router.get('/:userId', firebaseAuth, getRoadmap);

router.put(
  '/progress',
  firebaseAuth,
  [
    body('roadmapId').notEmpty().withMessage('roadmapId is required'),
    body('progressPercentage').isFloat({ min: 0, max: 100 }).withMessage('progressPercentage must be 0–100'),
    body('currentPhase').isInt({ min: 1, max: 3 }).withMessage('currentPhase must be 1, 2, or 3'),
  ],
  updateProgress
);

export default router;
