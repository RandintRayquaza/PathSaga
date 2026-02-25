import { validationResult } from 'express-validator';
import { db } from '../config/firebase.js';
import llmService from '../services/llmService.js';
import voiceInteractionSchema from '../models/voiceInteraction.schema.js';

const USERS = 'users';
const ROADMAPS = 'roadmaps';
const VOICE_INTERACTIONS = 'voiceInteractions';

export const processVoice = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg, data: null });
    }

    const uid = req.firebaseUser.uid;
    const { speechText, history = [] } = req.body;

    if (!speechText?.trim()) {
      return res.status(400).json({ success: false, message: 'speechText is required', data: null });
    }

    // Fetch user profile and latest roadmap/analysis concurrently
    const [userSnap, roadmapSnap] = await Promise.all([
      db.collection(USERS).doc(uid).get(),
      db.collection(ROADMAPS).where('userId', '==', uid).orderBy('createdAt', 'desc').limit(1).get(),
    ]);

    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found', data: null });
    }

    const userProfile = userSnap.data();
    const roadmapData = roadmapSnap.empty ? null : roadmapSnap.docs[0].data();
    const analysis = roadmapData?.analysis || null;
    const roadmap = roadmapData ? {
      phase1: roadmapData.phase1,
      phase2: roadmapData.phase2,
      phase3: roadmapData.phase3,
    } : null;

    const llmResponse = await llmService.processChat({
      message: speechText,
      userProfile,
      analysis,
      roadmap,
      history,
    });

    const doc = voiceInteractionSchema({
      userId: uid,
      speechText,
      llmResponse,
      pythonScore: null,
    });

    const saved = await db.collection(VOICE_INTERACTIONS).add(doc);

    return res.status(200).json({
      success: true,
      message: 'Chat response generated',
      data: { id: saved.id, response: llmResponse },
    });
  } catch (err) {
    next(err);
  }
};
