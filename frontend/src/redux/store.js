import { configureStore } from '@reduxjs/toolkit';
import authReducer       from './slices/authSlice';
import onboardingReducer from './slices/onboardingSlice';
import assessmentReducer from './slices/assessmentSlice';
import userReducer       from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth:       authReducer,
    onboarding: onboardingReducer,
    assessment: assessmentReducer,
    user:       userReducer,
  },
});
