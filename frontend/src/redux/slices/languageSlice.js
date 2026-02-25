import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'ps_lang';

const languageSlice = createSlice({
  name: 'language',
  initialState: {
    lang: localStorage.getItem(STORAGE_KEY) || 'en',
  },
  reducers: {
    setLanguage: (state, { payload }) => {
      state.lang = payload;
      localStorage.setItem(STORAGE_KEY, payload);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
