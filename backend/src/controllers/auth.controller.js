import { validationResult } from 'express-validator';
import { db } from '../config/firebase.js';
import userSchema from '../models/user.schema.js';

const USERS = 'users';

export const register = async (req, res, next) => {
  try {
    const { uid, email, name, phone_number } = req.firebaseUser;
    const userRef = db.collection(USERS).doc(uid);
    const snap = await userRef.get();

    if (snap.exists) {
      await userRef.update({ updatedAt: new Date().toISOString() });
      const updated = await userRef.get();
      return res.status(200).json({ success: true, message: 'User already registered', data: updated.data() });
    }

    const doc = userSchema({ uid, name, email, phoneNumber: phone_number });
    await userRef.set(doc);

    return res.status(201).json({ success: true, message: 'User registered successfully', data: doc });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const snap = await db.collection(USERS).doc(req.firebaseUser.uid).get();
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

    const { name, class: studentClass, stream, language } = req.body;
    const uid = req.firebaseUser.uid;
    const ref = db.collection(USERS).doc(uid);
    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(404).json({ success: false, message: 'User not found', data: null });
    }

    const updates = {
      ...(name && { name }),
      ...(studentClass && { class: studentClass }),
      ...(stream && { stream }),
      ...(language && { language }),
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
    const uid = req.firebaseUser.uid;
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
