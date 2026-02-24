import { createSlice } from '@reduxjs/toolkit';

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState: { currentStep: 0, answers: {}, completed: false, result: null },
  reducers: {
    nextStep:  (s) => { s.currentStep += 1; },
    prevStep:  (s) => { if (s.currentStep > 0) s.currentStep -= 1; },
    setAnswer: (s, { payload }) => { s.answers[payload.key] = payload.value; },
    setResult: (s, { payload }) => { s.result = payload; s.completed = true; },
    reset:     () => ({ currentStep: 0, answers: {}, completed: false, result: null }),
  },
});

export const { nextStep, prevStep, setAnswer, setResult, reset } = assessmentSlice.actions;
export default assessmentSlice.reducer;
