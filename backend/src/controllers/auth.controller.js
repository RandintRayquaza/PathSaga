import { validationResult } from 'express-validator';
import admin, { db } from '../config/firebase.js';
import userSchema from '../models/user.schema.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_pathsaga_2026';

const generateToken = (uid) => {
  return jwt.sign({ uid }, JWT_SECRET, { expiresIn: '7d' });
};

const USERS = 'users';
// ── Helper: determine which required fields are missing ────────────────────
export function getMissingFields(profile) {
  const missing = [];
  if (!profile.name?.trim())       missing.push('name');
  if (!profile.educationType)      missing.push('educationType');

  const isSchool  = profile.educationType === 'school';
  const isCollege = profile.educationType === 'college';

  if (isSchool && !profile.classLevel)               missing.push('classLevel');
  if (isCollege && !profile.degree?.trim())           missing.push('degree');
  if (isCollege && !profile.yearSemester)             missing.push('yearSemester');
  if (isCollege && !profile.specialization?.trim())   missing.push('specialization');

  // stream is required for school users, not for college
  if (isSchool && !profile.stream)                    missing.push('stream');

  // targetDomain not required when stream is 'Still Exploring'
  const isExploring = profile.stream === 'Still Exploring';
  if (!isExploring && !profile.targetDomain)          missing.push('targetDomain');
  if (profile.targetDomain === 'Other' && !profile.customDomain?.trim()) missing.push('customDomain');

  if (!profile.skillLevel)                            missing.push('skillLevel');

  return missing;
}

export const register = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'No token provided' });

    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, phone_number } = decodedToken;
    
    const userRef = db.collection(USERS).doc(uid);
    const snap = await userRef.get();

    if (snap.exists) {
      // If the user exists but has no name stored yet, update it from the token
      const existing = snap.data();
      const updates = { updatedAt: new Date().toISOString() };
      if (!existing.name && name) updates.name = name;
      await userRef.update(updates);
      const updated = await userRef.get();
      const backendToken = generateToken(uid);
      return res.status(200).json({ success: true, message: 'User already registered', data: { user: updated.data(), token: backendToken } });
    }

    const doc = userSchema({ uid, name, email, phoneNumber: phone_number });
    await userRef.set(doc);

    const backendToken = generateToken(uid);
    return res.status(201).json({ success: true, message: 'User registered successfully', data: { user: doc, token: backendToken } });
  } catch (err) {
    if (err.code && err.code.startsWith('auth/')) {
       return res.status(401).json({ success: false, message: 'Invalid or expired Firebase token' });
    }
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'No token provided' });

    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid } = decodedToken;

    const userRef = db.collection(USERS).doc(uid);
    const snap = await userRef.get();

    if (!snap.exists) {
      return res.status(404).json({ success: false, message: 'User not registered. Please sign up.' });
    }

    const backendToken = generateToken(uid);
    return res.status(200).json({ success: true, message: 'Login successful', data: { user: snap.data(), token: backendToken } });
  } catch (err) {
    if (err.code && err.code.startsWith('auth/')) {
       return res.status(401).json({ success: false, message: 'Invalid or expired Firebase token' });
    }
    next(err);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'No token provided' });

    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, phone_number } = decodedToken;

    const userRef = db.collection(USERS).doc(uid);
    const snap = await userRef.get();

    let userData;
    if (snap.exists) {
      userData = snap.data();
      const updates = { updatedAt: new Date().toISOString() };
      if (!userData.name && name) updates.name = name;
      await userRef.update(updates);
      const updated = await userRef.get();
      userData = updated.data();
    } else {
      userData = userSchema({ uid, name, email, phoneNumber: phone_number });
      await userRef.set(userData);
    }

    const backendToken = generateToken(uid);
    return res.status(200).json({ success: true, message: 'Google sign-in successful', data: { user: userData, token: backendToken } });
  } catch (err) {
    if (err.code && err.code.startsWith('auth/')) {
       return res.status(401).json({ success: false, message: 'Invalid or expired Firebase token' });
    }
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const snap = await db.collection(USERS).doc(req.user.uid).get();
    if (!snap.exists) {
      return res.status(404).json({ success: false, message: 'User not found. Please register first.', data: null });
    }
    return res.status(200).json({ success: true, message: 'Profile retrieved', data: snap.data() });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg, data: null });
    }

    const uid = req.user.uid;
    const ref = db.collection(USERS).doc(uid);
    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(404).json({ success: false, message: 'User not found', data: null });
    }

    const {
      name,
      educationType,
      classLevel,
      degree,
      yearSemester,
      specialization,
      subSpecialization,
      stream,
      targetDomain,
      customDomain,
      skillLevel,
      interests,
      customInstructions,
      studyHoursPerDay,
      languagePreference,
    } = req.body;

    // Merge submitted fields with existing data to evaluate completeness
    const existing = snap.data();
    const merged = { ...existing, ...req.body };
    const missingFields = getMissingFields(merged);
    const profileComplete = missingFields.length === 0;

    const updates = {
      ...(name !== undefined && { name }),
      ...(educationType !== undefined && { educationType }),
      ...(classLevel !== undefined && { classLevel }),
      ...(degree !== undefined && { degree }),
      ...(yearSemester !== undefined   && { yearSemester }),
      ...(specialization !== undefined    && { specialization }),
      ...(subSpecialization !== undefined  && { subSpecialization }),
      ...(stream !== undefined             && { stream }),
      ...(targetDomain !== undefined    && { targetDomain }),
      ...(customDomain !== undefined    && { customDomain }),
      ...(skillLevel !== undefined && { skillLevel }),
      ...(interests !== undefined && { interests: Array.isArray(interests) ? interests : [] }),
      ...(customInstructions !== undefined && { customInstructions }),
      ...(studyHoursPerDay !== undefined && { studyHoursPerDay }),
      ...(languagePreference !== undefined && { languagePreference }),
      profileComplete,
      updatedAt: new Date().toISOString(),
    };

    await ref.update(updates);
    const updated = await ref.get();
    return res.status(200).json({ success: true, message: 'Profile updated', data: updated.data() });
  } catch (err) {
    next(err);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const ref = db.collection(USERS).doc(uid);
    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(404).json({ success: false, message: 'User not found', data: null });
    }

    await ref.delete();
    return res.status(200).json({ success: true, message: 'Account deleted successfully', data: null });
  } catch (err) {
    next(err);
  }
};
