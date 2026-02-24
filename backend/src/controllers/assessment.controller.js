import { validationResult } from 'express-validator';
import { db } from '../config/firebase.js';
import assessmentSchema from '../models/assessment.schema.js';

const ASSESSMENTS = 'assessments';
const USERS = 'users';

export const startAssessment = async (req, res, next) => {
  try {
    const uid = req.firebaseUser.uid;

    const userSnap = await db.collection(USERS).doc(uid).get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found. Please register first.', data: null });
    }

    const existing = await db.collection(ASSESSMENTS).where('userId', '==', uid).limit(1).get();
    if (!existing.empty) {
      const doc = existing.docs[0];
      return res.status(200).json({
        success: true,
        message: 'Assessment already in progress',
        data: { id: doc.id, ...doc.data() },
      });
    }

    const doc = assessmentSchema({ userId: uid });
    const saved = await db.collection(ASSESSMENTS).add(doc);

    return res.status(201).json({ success: true, message: 'Assessment started', data: { id: saved.id, ...doc } });
  } catch (err) {
    next(err);
  }
};

export const submitAssessment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg, data: null });
    }

    const uid = req.firebaseUser.uid;
    const { logicalScore, creativeScore, verbalScore, interestTags } = req.body;

    const snap = await db.collection(ASSESSMENTS).where('userId', '==', uid).limit(1).get();

    let assessmentRef;
    if (snap.empty) {
      const doc = assessmentSchema({ userId: uid });
      assessmentRef = await db.collection(ASSESSMENTS).add(doc);
    } else {
      assessmentRef = snap.docs[0].ref;
    }

    await assessmentRef.update({
      logicalScore,
      creativeScore,
      verbalScore,
      interestTags: interestTags || [],
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const updated = await assessmentRef.get();
    return res.status(200).json({
      success: true,
      message: 'Assessment submitted successfully',
      data: { id: updated.id, ...updated.data() },
    });
  } catch (err) {
    next(err);
  }
};

export const getAssessment = async (req, res, next) => {
  try {
    const requestedUid = req.params.userId;
    const callerUid = req.firebaseUser.uid;

    if (requestedUid !== callerUid) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this assessment', data: null });
    }

    const snap = await db.collection(ASSESSMENTS).where('userId', '==', requestedUid).limit(1).get();
    if (snap.empty) {
      return res.status(404).json({ success: false, message: 'No assessment found for this user', data: null });
    }

    const doc = snap.docs[0];
    return res.status(200).json({ success: true, message: 'Assessment retrieved', data: { id: doc.id, ...doc.data() } });
  } catch (err) {
    next(err);
  }
};
