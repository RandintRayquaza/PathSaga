const careerRecommendationSchema = (data = {}) => ({
  userId: data.userId || null,
  recommendedCareers: data.recommendedCareers || [],
  fitPercentage: data.fitPercentage ?? null,
  missingSkills: data.missingSkills || [],
  roadmapId: data.roadmapId || null,
  source: data.source || 'hybrid',
  explanation: data.explanation || null,
  generatedAt: new Date().toISOString(),
});

export default careerRecommendationSchema;
