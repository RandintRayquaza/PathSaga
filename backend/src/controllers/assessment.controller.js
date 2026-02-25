import { db } from '../config/firebase.js';
import llmService from '../services/llmService.js';
import roadmapSchema from '../models/roadmap.schema.js';
import { getMissingFields } from './auth.controller.js';

const USERS = 'users';
const ROADMAPS = 'roadmaps';

// POST /api/assessment/generate-questions
export const generateQuestions = async (req, res, next) => {
  try {
    const uid = req.firebaseUser.uid;

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

    console.log(`[Assessment] Generating questions for ${uid} — domain: ${profile.targetDomain}, level: ${profile.skillLevel}`);
    const result = await llmService.generateAssessmentQuestions(profile);

    return res.status(200).json({
      success: true,
      message: 'Questions generated successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/assessment/submit-answers
export const submitAnswers = async (req, res, next) => {
  try {
    const uid = req.firebaseUser.uid;
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

    console.log(`[Assessment] Analyzing answers for ${uid}…`);
    const analysisResult = await llmService.analyzeAssessmentAnswers({ profile, questions, answers });

    console.log(`[Assessment] Generating roadmap for ${uid}…`);
    const roadmapResult = await llmService.generateFullRoadmap({
      profile,
      analysis: analysisResult.analysis,
    });

    // Delete any old roadmap for this user before saving new one
    const oldSnap = await db.collection(ROADMAPS).where('userId', '==', uid).get();
    const deleteOps = oldSnap.docs.map((d) => d.ref.delete());
    await Promise.all(deleteOps);

    // Store combined result in Firestore
    const doc = roadmapSchema({
      userId: uid,
      analysis: analysisResult.analysis,
      recommendedRoles: analysisResult.recommendedRoles,
      levelAssessment: analysisResult.levelAssessment,
      confidenceSummary: analysisResult.confidenceSummary,
      phase1: roadmapResult.roadmap?.phase1 || [],
      phase2: roadmapResult.roadmap?.phase2 || [],
      phase3: roadmapResult.roadmap?.phase3 || [],
      timelineEstimate: roadmapResult.timelineEstimate || null,
      careerStrategy: roadmapResult.careerStrategy || {},
      nextSteps: roadmapResult.nextSteps || [],
    });

    const saved = await db.collection(ROADMAPS).add(doc);

    // Mark user as having completed assessment
    await db.collection(USERS).doc(uid).update({
      assessmentComplete: true,
      updatedAt: new Date().toISOString(),
    });

    console.log(`[Assessment] Complete for ${uid} — roadmap saved: ${saved.id}`);

    return res.status(200).json({
      success: true,
      message: 'Assessment submitted and roadmap generated',
      data: { id: saved.id, ...doc },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/assessment/results
export const getResults = async (req, res, next) => {
  try {
    const uid = req.firebaseUser.uid;

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
