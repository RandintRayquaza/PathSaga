import { createSlice } from '@reduxjs/toolkit';

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState: {
    questions: [],       // Gemini-generated questions
    currentStep: 0,
    answers: {},         // { questionId: answerText }
    status: 'idle',      // 'idle' | 'generating' | 'submitting' | 'done' | 'error'
    errorMessage: null,
    missingFields: [],   // Profile fields that must be completed for assessment
    analysis: null,      // Gemini analysis result
    roadmap: null,       // Gemini roadmap result
    completed: false,
  },
  reducers: {
    setQuestions:   (s, { payload }) => { s.questions = payload; s.currentStep = 0; s.answers = {}; },
    setAnswer:      (s, { payload }) => { s.answers[payload.id] = payload.value; },
    nextStep:       (s) => { if (s.currentStep < s.questions.length - 1) s.currentStep += 1; },
    prevStep:       (s) => { if (s.currentStep > 0) s.currentStep -= 1; },
    setStatus:      (s, { payload }) => { s.status = payload; },
    setError:       (s, { payload }) => { s.errorMessage = payload; s.status = 'error'; },
    setMissingFields: (s, { payload }) => { s.missingFields = payload || []; },
    setResults:     (s, { payload }) => {
      s.analysis = payload.analysis;
      s.roadmap = payload.roadmap;
      s.completed = true;
      s.status = 'done';
    },
    resetAssessment: () => ({
      questions: [], currentStep: 0, answers: {}, status: 'idle',
      errorMessage: null, missingFields: [], analysis: null, roadmap: null, completed: false,
    }),
  },
});

export const {
  setQuestions, setAnswer, nextStep, prevStep,
  setStatus, setError, setMissingFields, setResults, resetAssessment,
} = assessmentSlice.actions;

export default assessmentSlice.reducer;
