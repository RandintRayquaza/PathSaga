import { GoogleGenerativeAI } from '@google/generative-ai';

const provider = process.env.LLM_PROVIDER || 'gemini';
const USE_MOCK = process.env.USE_MOCK_LLM === 'true';

const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not set');
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};



const mockCareerRecommendation = ({ assessmentScores }) => ({
  recommendedCareers: ['UX Designer', 'Product Manager', 'Frontend Developer'],
  fitPercentage: Math.round(
    ((assessmentScores.logicalScore + assessmentScores.creativeScore + assessmentScores.verbalScore) / 3)
  ),
  missingSkills: ['User Research', 'SQL', 'System Design'],
  explanation:
    'Based on your strong creative and logical scores, careers in design and product development align well with your profile. Your interest in technology and entrepreneurship further reinforce this direction.',
  roadmap: {
    phase1: ['Learn HTML, CSS & JavaScript basics', 'Complete UI/UX design course', 'Build 2 portfolio projects'],
    phase2: ['Learn React or Vue', 'Study product management frameworks', 'Contribute to open source'],
    phase3: ['Apply for internships', 'Build a SaaS side project', 'Prepare for job interviews'],
  },
  source: 'mock',
});

const mockRoadmap = ({ careerGoal }) => ({
  phase1: [
    `Research the ${careerGoal} field thoroughly`,
    'Identify top online courses and certifications',
    'Set up your learning environment and tools',
    'Join relevant communities and Discord servers',
  ],
  phase2: [
    'Complete your first major project',
    'Build a portfolio website',
    'Start networking with professionals on LinkedIn',
    'Apply for internships or freelance gigs',
  ],
  phase3: [
    'Land your first job or client',
    'Contribute to open-source or industry projects',
    'Pursue advanced certifications',
    'Mentor others and build your personal brand',
  ],
  source: 'mock',
});

const mockVoiceResponse = ({ speechText }) =>
  `Great question! Based on what you said — "${speechText.slice(0, 60)}..." — I'd recommend exploring careers in technology and design. Focus on building practical skills through hands-on projects and internships. Your curiosity is your biggest asset on this journey!`;

// ─── Helper: call Gemini or fall back to mock on 429 ───

const callGeminiOrMock = async (prompt, mockFn, args) => {
  if (USE_MOCK) {
    console.log('[LLM] USE_MOCK_LLM=true — returning mock response');
    return mockFn(args);
  }

  if (provider !== 'gemini') throw new Error(`Unsupported LLM provider: ${provider}`);

  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    if (err.message?.includes('429') || err.message?.includes('quota') || err.message?.includes('RESOURCE_EXHAUSTED')) {
      console.warn('[LLM] Gemini quota exceeded — using mock fallback');
      return mockFn(args);
    }
    throw err;
  }
};

// ─── Service ───

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

    const result = await callGeminiOrMock(prompt, mockCareerRecommendation, { userProfile, assessmentScores });

    // If mock was returned, it's already an object
    if (typeof result === 'object') return result;

    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Gemini returned non-JSON response');
    return JSON.parse(jsonMatch[0]);
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

    const result = await callGeminiOrMock(prompt, mockRoadmap, { userProfile, careerGoal });

    if (typeof result === 'object') return result;

    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Gemini returned non-JSON response');
    return JSON.parse(jsonMatch[0]);
  },

  processVoiceQuery: async ({ speechText, userProfile }) => {
    const prompt = `
You are PathSaga AI, a friendly career advisor. A student said:
"${speechText}"

Student context: Class ${userProfile.class || 'N/A'}, Stream ${userProfile.stream || 'N/A'}.

Give a concise, helpful 2–3 sentence career guidance response.
`.trim();

    const result = await callGeminiOrMock(prompt, mockVoiceResponse, { speechText, userProfile });

    if (typeof result === 'object') return result; // mock
    return result; // real gemini string response
  },
};

export default llmService;
