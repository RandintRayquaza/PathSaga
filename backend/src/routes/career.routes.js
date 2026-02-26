import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { generateCareer, getCareer } from '../controllers/career.controller.js';

const router = express.Router();

router.post('/generate', authMiddleware, generateCareer);
router.get('/:userId', authMiddleware, getCareer);

export default router;
