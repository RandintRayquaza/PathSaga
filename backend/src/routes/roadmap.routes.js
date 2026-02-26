import express from 'express';
import { body } from 'express-validator';
import authMiddleware from '../middleware/auth.middleware.js';
import * as roadmapController from '../controllers/roadmap.controller.js';

const router = express.Router();

router.post(
  '/generate',
  authMiddleware,
  [body('careerGoal').notEmpty().withMessage('careerGoal is required')],
  roadmapController.generateRoadmap
);

// MOST SPECIFIC ROUTES FIRST
// Get specifically by roadmap ID
router.get('/id/:roadmapId', authMiddleware, roadmapController.getRoadmapById);

// Get explicitly Roadmap History for a user
router.get('/history/:userId', authMiddleware, roadmapController.getAllRoadmaps);

// Dynamic path matching comes after explicit paths
router.get('/:userId', authMiddleware, roadmapController.getRoadmap);

router.put(
  '/progress',
  authMiddleware,
  [
    body('roadmapId').notEmpty().withMessage('roadmapId is required'),
    body('progressPercentage').isFloat({ min: 0, max: 100 }).withMessage('progressPercentage must be 0–100'),
    body('currentPhase').isInt({ min: 1, max: 3 }).withMessage('currentPhase must be 1, 2, or 3'),
  ],
  roadmapController.updateProgress
);

router.post(
  '/:roadmapId/generate-phase-todos',
  authMiddleware,
  [
    body('phaseNumber').isInt({ min: 1, max: 3 }).withMessage('phaseNumber must be 1, 2, or 3')
  ],
  roadmapController.generatePhaseTodos
);

router.post(
  '/unlock-next-phase',
  authMiddleware,
  [
    body('roadmapId').notEmpty().withMessage('roadmapId is required')
  ],
  roadmapController.unlockNextPhase
);

router.delete('/:roadmapId', authMiddleware, roadmapController.deleteRoadmap);

export default router;
