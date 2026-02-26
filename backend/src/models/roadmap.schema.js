const roadmapSchema = (data = {}) => ({
  userId: data.userId || null,
  version: data.version || 1,
  status: data.status || 'active', // 'active' | 'inactive'
  language: data.language || 'en', // Preserves the language the roadmap was generated in

  // Analysis from Gemini
  analysis: {
    strengths: data.analysis?.strengths || [],
    weaknesses: data.analysis?.weaknesses || [],
    skillGaps: data.analysis?.skillGaps || [],
  },
  recommendedRoles: data.recommendedRoles || [],
  levelAssessment: data.levelAssessment || null,
  confidenceSummary: data.confidenceSummary || null,

  // Roadmap content from LLM
  phase1: data.phase1 || [],
  phase2: data.phase2 || [],
  phase3: data.phase3 || [],

  // Structured Phases Trackers
  phases: data.phases || [
    { phaseNumber: 1, title: 'Phase 1', isUnlocked: true, maxTodos: 10 },
    { phaseNumber: 2, title: 'Phase 2', isUnlocked: false, maxTodos: 10 },
    { phaseNumber: 3, title: 'Phase 3', isUnlocked: false, maxTodos: 10 }
  ],

  // Extended roadmap context
  timelineEstimate: data.timelineEstimate || null,
  careerStrategy: data.careerStrategy || {},
  nextSteps: data.nextSteps || [],

  // Progress tracking
  progressPercentage: data.progressPercentage || 0,
  currentPhase: data.currentPhase || 1,

  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export default roadmapSchema;
