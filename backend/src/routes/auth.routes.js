import express from 'express';
import { body } from 'express-validator';
import authMiddleware from '../middleware/auth.middleware.js';
import { register, login, googleAuth, getMe, updateProfile, deleteAccount } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);

router.get('/me', authMiddleware, getMe);

router.put(
  '/update-profile',
  authMiddleware,
  [
    body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('educationType').optional().isIn(['school', 'college']).withMessage('educationType must be school or college'),
    body('skillLevel').optional().isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid skill level'),
    body('interests').optional().isArray().withMessage('interests must be an array'),
    body('languagePreference').optional().isIn(['en', 'hi']).withMessage('language must be en or hi'),
    body('studyHoursPerDay').optional().isNumeric().withMessage('studyHoursPerDay must be a number'),
  ],
  updateProfile
);

router.delete('/delete-account', authMiddleware, deleteAccount);

export default router;
