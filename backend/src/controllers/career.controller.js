import { db } from '../config/firebase.js';
import pythonService from '../services/pythonService.js';
import llmService from '../services/llmService.js';
import careerRecommendationSchema from '../models/careerRecommendation.schema.js';
import roadmapSchema from '../models/roadmap.schema.js';

const USERS = 'users';
const ASSESSMENTS = 'assessments';
const CAREER_RECS = 'careerRecommendations';
const ROADMAPS = 'roadmaps';

export const generateCareer = async (req, res, next) => {
  try {
    const uid = req.firebaseUser.uid;

    const [userSnap, assessmentSnap] = await Promise.all([
      db.collection(USERS).doc(uid).get(),
      db.collection(ASSESSMENTS).where('userId', '==', uid).limit(1).get(),
    ]);

    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found. Please register first.', data: null });
    }

    if (assessmentSnap.empty) {
      return res.status(400).json({ success: false, message: 'No assessment found. Please complete your assessment first.', data: null });
    }

    const userProfile = userSnap.data();
    const assessmentData = assessmentSnap.docs[0].data();

    let pythonResult = null;
    let source = 'llm';

    try {
      pythonResult = await pythonService.scoreAssessment(assessmentData);
      source = 'hybrid';
    } catch {
      source = 'llm';
    }

    const llmResult = await llmService.generateCareerRecommendation({
      userProfile,
      assessmentScores: assessmentData,
      pythonResult,
    });

    const roadmapDoc = roadmapSchema({
      userId: uid,
      phase1: llmResult.roadmap?.phase1 || [],
      phase2: llmResult.roadmap?.phase2 || [],
      phase3: llmResult.roadmap?.phase3 || [],
    });

    const savedRoadmap = await db.collection(ROADMAPS).add(roadmapDoc);

    const careerDoc = careerRecommendationSchema({
      userId: uid,
      recommendedCareers: llmResult.recommendedCareers,
      fitPercentage: pythonResult?.fitScore || llmResult.fitPercentage,
      missingSkills: llmResult.missingSkills,
      roadmapId: savedRoadmap.id,
      source,
      explanation: llmResult.explanation,
    });

    await db.collection(USERS).doc(uid).update({
      careerFitScore: careerDoc.fitPercentage,
      updatedAt: new Date().toISOString(),
    });

    const savedCareer = await db.collection(CAREER_RECS).add(careerDoc);

    return res.status(200).json({
      success: true,
      message: 'Career recommendation generated successfully',
      data: {
        id: savedCareer.id,
        ...careerDoc,
        roadmapId: savedRoadmap.id,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getCareer = async (req, res, next) => {
  try {
    const requestedUid = req.params.userId;
    const callerUid = req.firebaseUser.uid;

    if (requestedUid !== callerUid) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this data', data: null });
    }

    const snap = await db
      .collection(CAREER_RECS)
      .where('userId', '==', requestedUid)
      .orderBy('generatedAt', 'desc')
      .limit(1)
      .get();

    if (snap.empty) {
      return res.status(404).json({ success: false, message: 'No career recommendation found', data: null });
    }

    const doc = snap.docs[0];
    return res.status(200).json({ success: true, message: 'Career recommendation retrieved', data: { id: doc.id, ...doc.data() } });
  } catch (err) {
    next(err);
  }
};
