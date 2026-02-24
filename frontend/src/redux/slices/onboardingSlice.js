import { createSlice } from '@reduxjs/toolkit';

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: {
    step: 0,
    educationType: null,   // 'school' | 'college'
    classLevel: '',
    subjects: [],
    yearSemester: '',
    branch: '',
    interests: [],
    nextAction: null,      // 'assessment' | 'dashboard'
  },
  reducers: {
    nextStep:         (s) => { s.step += 1; },
    prevStep:         (s) => { if (s.step > 0) s.step -= 1; },
    setEducationType: (s, { payload }) => { s.educationType = payload; },
    setField:         (s, { payload }) => { s[payload.key] = payload.value; },
    toggleSubject:    (s, { payload }) => {
      s.subjects = s.subjects.includes(payload)
        ? s.subjects.filter((x) => x !== payload)
        : [...s.subjects, payload];
    },
    toggleInterest:   (s, { payload }) => {
      s.interests = s.interests.includes(payload)
        ? s.interests.filter((x) => x !== payload)
        : [...s.interests, payload];
    },
    setNextAction:    (s, { payload }) => { s.nextAction = payload; },
    resetOnboarding:  () => ({ step: 0, educationType: null, classLevel: '', subjects: [], yearSemester: '', branch: '', interests: [], nextAction: null }),
  },
});

export const { nextStep, prevStep, setEducationType, setField, toggleSubject, toggleInterest, setNextAction, resetOnboarding } = onboardingSlice.actions;
export default onboardingSlice.reducer;
