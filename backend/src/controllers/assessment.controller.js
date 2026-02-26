import { db } from '../config/firebase.js';
import llmController from '../services/llmController.js';
import roadmapSchema from '../models/roadmap.schema.js';
import { getMissingFields } from './auth.controller.js';
import { getCached, setCached } from '../services/assessmentCache.js';

const USERS = 'users';
const ROADMAPS = 'roadmaps';

// POST /api/assessment/generate-questions
export const generateQuestions = async (req, res, next) => {
  try {
    const uid = req.user.uid;

    const userSnap = await db.collection(USERS).doc(uid).get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found. Please complete your profile first.', data: null });
    }

    const profile = userSnap.data();
    const missingFields = getMissingFields(profile);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Please complete these profile fields before taking the assessment.',
        missingFields,
        data: null,
      });
    }

    // Phase 3: Immediate Cooldown Protection with a Firestore Transaction lock
    const cooldownMs = 60 * 1000;
    
    await db.runTransaction(async (transaction) => {
      const userRef = db.collection(USERS).doc(uid);
      const userDoc = await transaction.get(userRef);
      const data = userDoc.data();
      const lastReq = data.lastAssessmentRequest || 0;
      const now = Date.now();

      if (now - lastReq < cooldownMs) {
        const waitSecs = Math.ceil((cooldownMs - (now - lastReq)) / 1000);
        const err = new Error(`Please wait ${waitSecs} seconds before generating a new assessment.`);
        err.statusCode = 429;
        throw err;
      }

      // Update timestamp inside transaction lock immediately
      transaction.update(userRef, { lastAssessmentRequest: now });
    });

    // Check cache first — skip Gemini entirely
    const cached = getCached(uid, profile.targetDomain, profile.skillLevel);
    if (cached) {
      return res.status(200).json({
        success: true,
        message: 'Questions generated successfully',
        data: cached,
        fromCache: true
      });
    }

    console.log(`[Assessment] Generating questions for ${uid} — domain: ${profile.targetDomain}, level: ${profile.skillLevel}`);

    const result = await llmController.generateAssessmentQuestions({ userId: uid, profile });

    setCached(uid, profile.targetDomain, profile.skillLevel, result);

    return res.status(200).json({
      success: true,
      message: 'Questions generated successfully',
      data: result,
      fromCache: false
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/assessment/submit-answers
export const submitAnswers = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const { questions, answers } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'questions array is required', data: null });
    }
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ success: false, message: 'answers object is required', data: null });
    }

    const userSnap = await db.collection(USERS).doc(uid).get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found.', data: null });
    }

    const profile = userSnap.data();

    console.log(`[Assessment] Analyzing answers & generating roadmap for ${uid} (Combined LLM Call)…`);
    const combinedResult = await llmController.processAssessmentAndRoadmap({ 
      userId: uid, 
      profile, 
      questions, 
      answers 
    });

    // Transactional Roadmap Save:
    // We must find the user's currently 'active' roadmap (if any).
    // Mark it 'inactive'.
    // Save the new roadmap as 'active' with version + 1.
    const activeRoadmapsSnap = await db.collection(ROADMAPS)
      .where('userId', '==', uid)
      .where('status', '==', 'active')
      .get();
      
    let oldVersion = 0;
    const oldRefs = [];
    if (!activeRoadmapsSnap.empty) {
       activeRoadmapsSnap.docs.forEach(doc => {
         const data = doc.data();
         if (data.version > oldVersion) oldVersion = data.version;
         oldRefs.push(doc.ref);
       });
    }

    const newDocRef = db.collection(ROADMAPS).doc();

    const newDocData = roadmapSchema({
      userId: uid,
      version: oldVersion + 1,
      status: 'active',
      analysis: combinedResult.analysis,
      recommendedRoles: combinedResult.recommendedRoles,
      levelAssessment: combinedResult.levelAssessment,
      confidenceSummary: combinedResult.confidenceSummary,
      phase1: combinedResult.roadmap?.phase1 || [],
      phase2: combinedResult.roadmap?.phase2 || [],
      phase3: combinedResult.roadmap?.phase3 || [],
      timelineEstimate: combinedResult.timelineEstimate || null,
      careerStrategy: combinedResult.careerStrategy || {},
      nextSteps: combinedResult.nextSteps || [],
    });

    // Run strictly awaited transaction
    await db.runTransaction(async (transaction) => {
      // 1. Archive old roadmaps
      for (const ref of oldRefs) {
         transaction.update(ref, { status: 'inactive', updatedAt: new Date().toISOString() });
      }
      // 2. Insert new
      transaction.set(newDocRef, newDocData);
      // 3. Update user profile to reflect completion
      const userRef = db.collection(USERS).doc(uid);
      transaction.update(userRef, {
        assessmentComplete: true,
        updatedAt: new Date().toISOString()
      });
    });

    console.log(`[Assessment] Complete for ${uid} — roadmap saved: ${newDocRef.id} (Version ${newDocData.version})`);

    return res.status(200).json({
      success: true,
      roadmapId: newDocRef.id,
      version: newDocData.version,
      message: 'Assessment submitted and roadmap securely generated',
      data: { id: newDocRef.id, ...newDocData },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/assessment/results
export const getResults = async (req, res, next) => {
  try {
    const uid = req.user.uid;

    const snap = await db
      .collection(ROADMAPS)
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (snap.empty) {
      return res.status(404).json({ success: false, message: 'No assessment results found. Please take the assessment first.', data: null });
    }

    const doc = snap.docs[0];
    return res.status(200).json({ success: true, message: 'Results retrieved', data: { id: doc.id, ...doc.data() } });
  } catch (err) {
    next(err);
  }
};
