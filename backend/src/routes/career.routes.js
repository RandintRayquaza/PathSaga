import express from 'express';
import firebaseAuth from '../middleware/firebaseAuth.middleware.js';
import { generateCareer, getCareer } from '../controllers/career.controller.js';

const router = express.Router();

router.post('/generate', firebaseAuth, generateCareer);
router.get('/:userId', firebaseAuth, getCareer);

export default router;
