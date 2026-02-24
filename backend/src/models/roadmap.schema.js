const roadmapSchema = (data = {}) => ({
  userId: data.userId || null,
  phase1: data.phase1 || [],
  phase2: data.phase2 || [],
  phase3: data.phase3 || [],
  progressPercentage: data.progressPercentage ?? 0,
  currentPhase: data.currentPhase ?? 1,
  updatedAt: new Date().toISOString(),
  createdAt: data.createdAt || new Date().toISOString(),
});

export default roadmapSchema;
