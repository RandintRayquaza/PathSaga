import { createSlice } from '@reduxjs/toolkit';

/* Mock data — replace with API responses */
const MOCK = {
  careerFit:  null,
  skillGaps:  [],
  roadmap:    [],
  tasks:      [],
  profile:    null,
};

const userSlice = createSlice({
  name: 'user',
  initialState: MOCK,
  reducers: {
    setCareerFit:  (s, { payload }) => { s.careerFit = payload; },
    setSkillGaps:  (s, { payload }) => { s.skillGaps = payload; },
    setRoadmap:    (s, { payload }) => { s.roadmap   = payload; },
    setTasks:      (s, { payload }) => { s.tasks     = payload; },
    setProfile:    (s, { payload }) => { s.profile   = payload; },
    toggleTask:    (s, { payload }) => {
      const t = s.tasks.find((t) => t.id === payload);
      if (t) t.done = !t.done;
    },
  },
});

export const { setCareerFit, setSkillGaps, setRoadmap, setTasks, setProfile, toggleTask } = userSlice.actions;
export default userSlice.reducer;
