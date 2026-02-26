import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { generateQuestions, submitAnswers, getResults } from '../controllers/assessment.controller.js';
import { assessmentLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Generate Gemini questions based on user profile
router.post('/generate-questions', authMiddleware, assessmentLimiter, generateQuestions);

// Submit answers — triggers analysis + roadmap generation + Firestore save
router.post('/submit-answers', authMiddleware, submitAnswers);

// Get latest assessment results (analysis + roadmap)
router.get('/results', authMiddleware, getResults);

export default router;
