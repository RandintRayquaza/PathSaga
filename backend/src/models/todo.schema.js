const todoSchema = (data = {}) => ({
  userId: data.userId || null,
  roadmapId: data.roadmapId || null,
  phaseNumber: data.phaseNumber || 1,
  title: data.title || '',
  description: data.description || '',
  status: data.status || 'pending', // 'pending' | 'completed'
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export default todoSchema;
