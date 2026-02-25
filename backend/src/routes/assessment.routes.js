import express from 'express';
import firebaseAuth from '../middleware/firebaseAuth.middleware.js';
import { generateQuestions, submitAnswers, getResults } from '../controllers/assessment.controller.js';

const router = express.Router();

// Generate Gemini questions based on user profile
router.post('/generate-questions', firebaseAuth, generateQuestions);

// Submit answers — triggers analysis + roadmap generation + Firestore save
router.post('/submit-answers', firebaseAuth, submitAnswers);

// Get latest assessment results (analysis + roadmap)
router.get('/results', firebaseAuth, getResults);

export default router;
