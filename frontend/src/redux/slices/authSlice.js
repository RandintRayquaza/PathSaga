import { createSlice } from '@reduxjs/toolkit';

const getStoredToken = () => {
  return localStorage.getItem('token');
};

const authSlice = createSlice({
  name: 'auth',
  initialState: { isAuthenticated: !!getStoredToken(), user: null, loading: false, error: null },
  reducers: {
    loginStart:   (s) => { s.loading = true; s.error = null; },
    loginSuccess: (s, { payload }) => { 
      s.loading = false; 
      s.isAuthenticated = true; 
      s.user = payload; 
    },
    loginFailure: (s, { payload }) => { s.loading = false; s.error = payload; },
    logout:       (s) => { 
      s.isAuthenticated = false; 
      s.user = null; 
      localStorage.removeItem('token');
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
