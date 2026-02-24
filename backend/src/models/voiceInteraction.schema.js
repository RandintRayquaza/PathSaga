const voiceInteractionSchema = (data = {}) => ({
  userId: data.userId || null,
  speechText: data.speechText || null,
  llmResponse: data.llmResponse || null,
  pythonScore: data.pythonScore ?? null,
  audioResponseUrl: data.audioResponseUrl || null,
  createdAt: new Date().toISOString(),
});

export default voiceInteractionSchema;
