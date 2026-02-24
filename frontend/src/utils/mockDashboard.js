/* ─── MOCK DATA ─────────────────────────────────────────
   All data below is hardcoded for UI development.
   Replace each value with real API responses when backend
   endpoints are connected.
   ──────────────────────────────────────────────────────── */

export const MOCK_CAREER_FIT = {
  title:       'UX Designer',
  score:       82,
  description: 'Your empathy, visual thinking, and problem-solving profile aligns strongly with UX design roles.',
  topSkills:   ['User Research', 'Wireframing', 'Prototyping'],
};

export const MOCK_SKILL_GAPS = [
  { skill: 'Figma',          level: 'Beginner',     priority: 'High'   },
  { skill: 'User Research',  level: 'Intermediate',  priority: 'Medium' },
  { skill: 'Design Systems', level: 'None',          priority: 'High'   },
  { skill: 'Accessibility',  level: 'Beginner',      priority: 'Low'    },
];

export const MOCK_ROADMAP = [
  { phase: 'Phase 1 — Foundation', milestones: [
    { label: 'Complete Figma basics course',      progress: 100 },
    { label: 'Build your first wireframe project', progress: 60  },
  ]},
  { phase: 'Phase 2 — Build',      milestones: [
    { label: 'Conduct 3 user interviews',          progress: 20  },
    { label: 'Create a full case study',           progress: 0   },
  ]},
  { phase: 'Phase 3 — Launch',     milestones: [
    { label: 'Publish portfolio',                  progress: 0   },
    { label: 'Apply to 10 junior UX roles',        progress: 0   },
  ]},
];

export const MOCK_TASKS = [
  { id: 1, label: 'Finish Figma UI Kit exercise',      done: true  },
  { id: 2, label: 'Watch UX research principles video', done: true  },
  { id: 3, label: 'Redesign 2 app screens',             done: false },
  { id: 4, label: 'Write first case study draft',       done: false },
  { id: 5, label: 'Connect with 3 UX professionals',   done: false },
];
