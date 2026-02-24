import axios from 'axios';

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
const TIMEOUT_MS = 10000;

const pythonService = {
  scoreAssessment: async (assessmentData) => {
    const response = await axios.post(
      `${PYTHON_SERVICE_URL}/api/score`,
      assessmentData,
      { timeout: TIMEOUT_MS }
    );
    return response.data;
  },

  scoreVoiceInput: async (speechText, userProfile) => {
    const response = await axios.post(
      `${PYTHON_SERVICE_URL}/api/voice-score`,
      { speechText, userProfile },
      { timeout: TIMEOUT_MS }
    );
    return response.data;
  },
};

export default pythonService;
