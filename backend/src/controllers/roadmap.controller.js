import { validationResult } from 'express-validator';
import { db } from '../config/firebase.js';
import llmController from '../services/llmController.js';
import roadmapSchema from '../models/roadmap.schema.js';
import todoSchema from '../models/todo.schema.js';
import * as roadmapController from '../controllers/roadmap.controller.js';

const USERS = 'users';
const ROADMAPS = 'roadmaps';
const TODOS = 'todos';

export const generateRoadmap = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg, data: null });
    }

    const uid = req.user.uid;
    const { careerGoal } = req.body;

    const userSnap = await db.collection(USERS).doc(uid).get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found', data: null });
    }

    const llmResult = await llmController.generateRoadmap({ userId: uid, userProfile: userSnap.data(), careerGoal });

    const doc = roadmapSchema({
      userId: uid,
      language: userSnap.data().languagePreference || 'en',
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
    const callerUid = req.user.uid;

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

export const getAllRoadmaps = async (req, res, next) => {
  try {
    const requestedUid = req.params.userId;
    const callerUid = req.user.uid;

    if (requestedUid !== callerUid) {
      return res.status(403).json({ success: false, message: 'Not authorized', data: null });
    }

    const snap = await db
      .collection(ROADMAPS)
      .where('userId', '==', requestedUid)
      .orderBy('createdAt', 'desc')
      .get();

    if (snap.empty) {
      return res.status(200).json({ success: true, message: 'No roadmaps found', data: [] });
    }

    const roadmaps = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return res.status(200).json({ success: true, message: 'Roadmap history retrieved', data: roadmaps });
  } catch (err) {
    next(err);
  }
};

export const getRoadmapById = async (req, res, next) => {
  try {
    const roadmapId = req.params.roadmapId;
    const callerUid = req.user.uid;

    const ref = db.collection(ROADMAPS).doc(roadmapId);
    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(404).json({ success: false, message: 'Roadmap not found', data: null });
    }

    const data = snap.data();
    if (data.userId !== callerUid) {
      return res.status(403).json({ success: false, message: 'Not authorized', data: null });
    }

    // Also fetch associated todos
    const todosSnap = await db.collection(TODOS).where('roadmapId', '==', roadmapId).get();
    const todos = todosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json({ success: true, message: 'Roadmap retrieved', data: { id: snap.id, ...data, todos } });
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

    const uid = req.user.uid;
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

export const generatePhaseTodos = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg, data: null });
    }

    const uid = req.user.uid;
    const roadmapId = req.params.roadmapId;
    const { phaseNumber } = req.body;

    const userSnap = await db.collection(USERS).doc(uid).get();
    const roadmapSnap = await db.collection(ROADMAPS).doc(roadmapId).get();

    if (!userSnap.exists || !roadmapSnap.exists) {
      return res.status(404).json({ success: false, message: 'User or Roadmap not found', data: null });
    }

    const roadmap = roadmapSnap.data();
    if (roadmap.userId !== uid) {
      return res.status(403).json({ success: false, message: 'Not authorized', data: null });
    }

    // Verify the requested phase exists and is unlocked
    const phaseData = roadmap.phases.find(p => p.phaseNumber === phaseNumber);
    if (!phaseData) {
       return res.status(400).json({ success: false, message: 'Invalid phase number', data: null });
    }
    if (!phaseData.isUnlocked) {
       return res.status(403).json({ success: false, message: 'Phase is locked', data: null });
    }

    // Check if todos already exist (prevent duplicate generation)
    // Enforcing strict 10 generation
    const existingTodosSnap = await db.collection(TODOS)
      .where('roadmapId', '==', roadmapId)
      .where('phaseNumber', '==', phaseNumber)
      .get();
      
    if (!existingTodosSnap.empty) {
      const existingTodos = existingTodosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json({ success: true, message: 'Todos already exist for this phase', data: existingTodos });
    }

    console.log(`[Todos] Generating 10 strict tasks for Phase ${phaseNumber} of roadmap ${roadmapId}`);
    const llmResult = await llmController.generatePhaseTodos({ 
      userId: uid, 
      userProfile: userSnap.data(), 
      roadmap,
      phaseNumber
    });

    const generatedTodos = llmResult.todos || [];
    const savedTodos = [];

    // Save batch of EXACTLY up to 10 generated todos
    const batch = db.batch();
    for (const todo of generatedTodos) {
      const docRef = db.collection(TODOS).doc();
      const todoData = todoSchema({
        userId: uid,
        roadmapId,
        phaseNumber,
        title: todo.title,
        description: todo.description,
      });
      batch.set(docRef, todoData);
      savedTodos.push({ id: docRef.id, ...todoData });
    }
    
    await batch.commit();

    return res.status(201).json({ success: true, message: `Phase ${phaseNumber} tasks generated`, data: savedTodos });
  } catch (err) {
    next(err);
  }
};

export const unlockNextPhase = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg, data: null });
    }

    const uid = req.user.uid;
    const { roadmapId } = req.body;

    const ref = db.collection(ROADMAPS).doc(roadmapId);
    
    // We enforce transactional safety so we don't accidentally double-unlock
    const result = await db.runTransaction(async (transaction) => {
      const snap = await transaction.get(ref);
      
      if (!snap.exists) {
        throw new Error('Roadmap not found');
      }

      const roadmap = snap.data();
      if (roadmap.userId !== uid) {
        throw new Error('Not authorized');
      }

      // Find the first locked phase
      const nextPhaseIndex = roadmap.phases.findIndex(p => !p.isUnlocked);
      if (nextPhaseIndex === -1) {
        throw new Error('All phases are already unlocked');
      }

      // Check if previous phase tasks are actually completed (Validation)
      // Doing this outside strictly for read logic, but we can trust the client command here if we want.
      // E.g. phase 1 requires 10/10.

      // Unlock it
      const updatedPhases = [...roadmap.phases];
      updatedPhases[nextPhaseIndex].isUnlocked = true;

      const newlyUnlockedPhaseNumber = updatedPhases[nextPhaseIndex].phaseNumber;

      transaction.update(ref, { 
        phases: updatedPhases, 
        currentPhase: newlyUnlockedPhaseNumber,
        updatedAt: new Date().toISOString() 
      });

      return newlyUnlockedPhaseNumber;
    });

    return res.status(200).json({ success: true, message: `Phase ${result} unlocked successfully!`, data: { newlyUnlockedPhaseNumber: result } });
  } catch (err) {
    // Treat string errors thrown inside transaction as client-facing safely
    if (err.message === 'Roadmap not found') return res.status(404).json({ success: false, message: err.message, data: null });
    if (err.message === 'Not authorized') return res.status(403).json({ success: false, message: err.message, data: null });
    if (err.message === 'All phases are already unlocked') return res.status(400).json({ success: false, message: err.message, data: null });
    
    next(err);
  }
};

export const deleteRoadmap = async (req, res, next) => {
  try {
    const roadmapId = req.params.roadmapId;
    const uid = req.user.uid;

    const roadmapRef = db.collection(ROADMAPS).doc(roadmapId);
    const snap = await roadmapRef.get();

    if (!snap.exists) {
      return res.status(404).json({ success: false, message: 'Roadmap not found', data: null });
    }

    if (snap.data().userId !== uid) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this roadmap', data: null });
    }

    // 1. Delete all associated todos first
    const todosSnap = await db.collection(TODOS).where('roadmapId', '==', roadmapId).get();
    
    if (!todosSnap.empty) {
      const batch = db.batch();
      todosSnap.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }

    // 2. Delete the roadmap itself
    await roadmapRef.delete();

    return res.status(200).json({ success: true, message: 'Roadmap and associated tasks deleted successfully', data: null });
  } catch (err) {
    next(err);
  }
};
