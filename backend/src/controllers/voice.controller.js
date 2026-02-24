import { validationResult } from 'express-validator';
import { db } from '../config/firebase.js';
import pythonService from '../services/pythonService.js';
import llmService from '../services/llmService.js';
import voiceInteractionSchema from '../models/voiceInteraction.schema.js';

const USERS = 'users';
const VOICE_INTERACTIONS = 'voiceInteractions';

export const processVoice = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg, data: null });
    }

    const uid = req.firebaseUser.uid;
    const { speechText } = req.body;

    const userSnap = await db.collection(USERS).doc(uid).get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found', data: null });
    }

    const userProfile = userSnap.data();

    const [llmResponse, pythonResult] = await Promise.allSettled([
      llmService.processVoiceQuery({ speechText, userProfile }),
      pythonService.scoreVoiceInput(speechText, userProfile),
    ]);

    const llmText = llmResponse.status === 'fulfilled' ? llmResponse.value : 'I could not generate a response at this time.';
    const pythonScore = pythonResult.status === 'fulfilled' ? pythonResult.value?.score : null;

    const doc = voiceInteractionSchema({
      userId: uid,
      speechText,
      llmResponse: llmText,
      pythonScore,
    });

    const saved = await db.collection(VOICE_INTERACTIONS).add(doc);

    return res.status(200).json({
      success: true,
      message: 'Voice query processed successfully',
      data: { id: saved.id, ...doc },
    });
  } catch (err) {
    next(err);
  }
};
