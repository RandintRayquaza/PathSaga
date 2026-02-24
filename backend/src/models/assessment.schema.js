const assessmentSchema = (data = {}) => ({
  userId: data.userId || null,
  logicalScore: data.logicalScore ?? null,
  creativeScore: data.creativeScore ?? null,
  verbalScore: data.verbalScore ?? null,
  interestTags: data.interestTags || [],
  completedAt: data.completedAt || null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export default assessmentSchema;
