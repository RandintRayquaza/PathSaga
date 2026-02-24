import { GoogleGenerativeAI } from '@google/generative-ai';

const provider = process.env.LLM_PROVIDER || 'gemini';

const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not set');
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

const llmService = {
  generateCareerRecommendation: async ({ userProfile, assessmentScores, pythonResult }) => {
    const prompt = `
You are PathSaga AI, a career guidance assistant for first-generation learners in India.

Student profile:
- Name: ${userProfile.name || 'Student'}
- Class: ${userProfile.class || 'N/A'}
- Stream: ${userProfile.stream || 'N/A'}
- Language: ${userProfile.language || 'en'}
- Interest tags: ${assessmentScores.interestTags?.join(', ') || 'N/A'}

Assessment scores (0–100):
- Logical: ${assessmentScores.logicalScore}
- Creative: ${assessmentScores.creativeScore}
- Verbal: ${assessmentScores.verbalScore}

Python engine fit score: ${pythonResult?.fitScore || 'N/A'}
Python recommended domains: ${pythonResult?.domains?.join(', ') || 'N/A'}

Return ONLY valid JSON in this exact format:
{
  "recommendedCareers": ["Career 1", "Career 2", "Career 3"],
  "fitPercentage": 82,
  "missingSkills": ["Skill A", "Skill B"],
  "explanation": "2–3 sentence explanation of why these careers fit.",
  "roadmap": {
    "phase1": ["Step 1", "Step 2", "Step 3"],
    "phase2": ["Step 4", "Step 5", "Step 6"],
    "phase3": ["Step 7", "Step 8", "Step 9"]
  }
}
`.trim();

    if (provider === 'gemini') {
      const genAI = getGeminiClient();
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Gemini returned non-JSON response');
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error(`Unsupported LLM provider: ${provider}`);
  },

  generateRoadmap: async ({ userProfile, careerGoal }) => {
    const prompt = `
You are PathSaga AI. Generate a 3-phase learning roadmap for:
- Career goal: ${careerGoal}
- Student class: ${userProfile.class || 'N/A'}
- Stream: ${userProfile.stream || 'N/A'}

Return ONLY valid JSON:
{
  "phase1": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "phase2": ["Step 5", "Step 6", "Step 7", "Step 8"],
  "phase3": ["Step 9", "Step 10", "Step 11", "Step 12"]
}
`.trim();

    if (provider === 'gemini') {
      const genAI = getGeminiClient();
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Gemini returned non-JSON response');
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error(`Unsupported LLM provider: ${provider}`);
  },

  processVoiceQuery: async ({ speechText, userProfile }) => {
    const prompt = `
You are PathSaga AI, a friendly career advisor. A student said:
"${speechText}"

Student context: Class ${userProfile.class || 'N/A'}, Stream ${userProfile.stream || 'N/A'}.

Give a concise, helpful 2–3 sentence career guidance response.
`.trim();

    if (provider === 'gemini') {
      const genAI = getGeminiClient();
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    }

    throw new Error(`Unsupported LLM provider: ${provider}`);
  },
};

export default llmService;
