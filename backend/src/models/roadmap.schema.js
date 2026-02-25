const roadmapSchema = (data = {}) => ({
  userId: data.userId || null,

  // Analysis from Gemini
  analysis: {
    strengths: data.analysis?.strengths || [],
    weaknesses: data.analysis?.weaknesses || [],
    skillGaps: data.analysis?.skillGaps || [],
  },
  recommendedRoles: data.recommendedRoles || [],
  levelAssessment: data.levelAssessment || null,
  confidenceSummary: data.confidenceSummary || null,

  // Roadmap phases
  phase1: data.phase1 || [],
  phase2: data.phase2 || [],
  phase3: data.phase3 || [],

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
