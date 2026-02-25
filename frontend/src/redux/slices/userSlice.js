import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    results: null,       // Full Firestore roadmap document (includes analysis + roadmap + strategy)
    loadingResults: false,
    resultsError: null,
  },
  reducers: {
    setResults:       (s, { payload }) => { s.results = payload; s.loadingResults = false; s.resultsError = null; },
    setLoadingResults:(s, { payload }) => { s.loadingResults = payload; },
    setResultsError:  (s, { payload }) => { s.resultsError = payload; s.loadingResults = false; },
    clearResults:     (s) => { s.results = null; s.resultsError = null; },
  },
});

export const { setResults, setLoadingResults, setResultsError, clearResults } = userSlice.actions;
export default userSlice.reducer;
