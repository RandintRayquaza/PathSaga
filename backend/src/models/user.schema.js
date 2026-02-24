const userSchema = (data = {}) => ({
  uid: data.uid || null,
  name: data.name || null,
  email: data.email || null,
  class: data.class || null,
  stream: data.stream || null,
  language: data.language || 'en',
  careerFitScore: data.careerFitScore || null,
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export default userSchema;
