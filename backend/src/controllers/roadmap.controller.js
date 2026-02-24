import { validationResult } from 'express-validator';
import { db } from '../config/firebase.js';
import llmService from '../services/llmService.js';
import roadmapSchema from '../models/roadmap.schema.js';

const USERS = 'users';
const ROADMAPS = 'roadmaps';

export const generateRoadmap = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg, data: null });
    }

    const uid = req.firebaseUser.uid;
    const { careerGoal } = req.body;

    const userSnap = await db.collection(USERS).doc(uid).get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found', data: null });
    }

    const llmResult = await llmService.generateRoadmap({ userProfile: userSnap.data(), careerGoal });

    const doc = roadmapSchema({
      userId: uid,
      phase1: llmResult.phase1 || [],
      phase2: llmResult.phase2 || [],
      phase3: llmResult.phase3 || [],
    });

    const saved = await db.collection(ROADMAPS).add(doc);

    return res.status(201).json({ success: true, message: 'Roadmap generated successfully', data: { id: saved.id, ...doc } });
  } catch (err) {
    next(err);
  }
};

export const getRoadmap = async (req, res, next) => {
  try {
    const requestedUid = req.params.userId;
    const callerUid = req.firebaseUser.uid;

    if (requestedUid !== callerUid) {
      return res.status(403).json({ success: false, message: 'Not authorized', data: null });
    }

    const snap = await db
      .collection(ROADMAPS)
      .where('userId', '==', requestedUid)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (snap.empty) {
      return res.status(404).json({ success: false, message: 'No roadmap found', data: null });
    }

    const doc = snap.docs[0];
    return res.status(200).json({ success: true, message: 'Roadmap retrieved', data: { id: doc.id, ...doc.data() } });
  } catch (err) {
    next(err);
  }
};

export const updateProgress = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg, data: null });
    }

    const uid = req.firebaseUser.uid;
    const { roadmapId, progressPercentage, currentPhase } = req.body;

    const ref = db.collection(ROADMAPS).doc(roadmapId);
    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(404).json({ success: false, message: 'Roadmap not found', data: null });
    }

    if (snap.data().userId !== uid) {
      return res.status(403).json({ success: false, message: 'Not authorized', data: null });
    }

    await ref.update({ progressPercentage, currentPhase, updatedAt: new Date().toISOString() });
    const updated = await ref.get();

    return res.status(200).json({ success: true, message: 'Progress updated', data: { id: updated.id, ...updated.data() } });
  } catch (err) {
    next(err);
  }
};
