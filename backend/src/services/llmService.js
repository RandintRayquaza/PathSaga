import { GoogleGenerativeAI } from '@google/generative-ai';

const USE_MOCK = process.env.USE_MOCK_LLM === 'true';

const getModel = (systemInstruction = null) => {
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not set');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    ...(systemInstruction && { systemInstruction }),
  });
};

// ─── Retry / Rate-limit helper ───────────────────────────────────────────────

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const withRetry = async (fn, { maxAttempts = 3, label = 'LLM' } = {}) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isRate =
        err.message?.includes('429') ||
        err.message?.includes('quota') ||
        err.message?.includes('RESOURCE_EXHAUSTED') ||
        err.status === 429;

      if (isRate && attempt < maxAttempts) {
        // Exponential backoff with jitter: ~4s, then ~9s
        const baseWait = Math.pow(2, attempt) * 2000;
        const jitter = Math.random() * 1000;
        const waitMs = baseWait + jitter;
        
        console.warn(`[${label}] Rate limited (attempt ${attempt}/${maxAttempts}). Retrying in ${(waitMs / 1000).toFixed(1)}s…`);
        await delay(waitMs);
        continue;
      }

      if (isRate) {
        const rateErr = new Error('AI is currently experiencing high demand. Please try again in a few moments.');
        rateErr.statusCode = 429;
        throw rateErr;
      }
      throw err;
    }
  }
};

// ─── JSON parse helper ────────────────────────────────────────────────────────

const extractJSON = (text) => {
  // Strip markdown code fences if Gemini wraps the JSON
  const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
  try {
    return JSON.parse(clean);
  } catch {
    const match = clean.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Gemini returned non-JSON response');
    return JSON.parse(match[0]);
  }
};

// ─── 1. Generate Assessment Questions ────────────────────────────────────────

const generateAssessmentQuestions = async (profile) => {
  if (USE_MOCK) {
    return {
      questions: [
        { id: 1, question: 'What does HTML stand for?', type: 'mcq', difficulty: 'easy', options: ['HyperText Markup Language', 'HyperTool Markup Logic', 'HighText Machine Language', 'None of these'] },
        { id: 2, question: 'Explain the difference between == and === in JavaScript.', type: 'short-answer', difficulty: 'medium' },
      ],
    };
  }

  const prompt = `
You are an expert technical assessor for ${profile.targetDomain || 'software development'}.

Student profile:
- Education: ${profile.educationType === 'school' ? `Class ${profile.classLevel}` : `${profile.degree}, ${profile.yearSemester}`}
- Stream: ${profile.stream || 'N/A'}
- Target domain: ${profile.targetDomain}
- Skill level: ${profile.skillLevel}
- Interests: ${profile.interests?.join(', ') || 'N/A'}
- Custom instructions: ${profile.customInstructions || 'None'}

Generate exactly 10 assessment questions.

Rules:
- Beginner → fundamentals and concepts only
- Intermediate → applied, practical, scenario-based
- Advanced → architecture, optimization, trade-offs, system design
- Questions MUST be specific to "${profile.targetDomain}" — no generic career questions
- MCQ must have exactly 4 options, one correct

Return ONLY valid JSON, no explanation:
{
  "questions": [
    {
      "id": 1,
      "question": "...",
      "type": "mcq",
      "difficulty": "easy",
      "options": ["A", "B", "C", "D"]
    },
    {
      "id": 2,
      "question": "...",
      "type": "short-answer",
      "difficulty": "medium"
    }
  ]
}
`.trim();

  return withRetry(async () => {
    const model = getModel();
    const result = await model.generateContent(prompt);
    return extractJSON(result.response.text());
  });
};

// ─── 2. Analyze Assessment Answers ───────────────────────────────────────────

const analyzeAssessmentAnswers = async ({ profile, questions, answers }) => {
  if (USE_MOCK) {
    return {
      analysis: {
        strengths: ['Basic understanding of fundamentals'],
        weaknesses: ['Lacks practical project experience'],
        skillGaps: ['No hands-on with real tools'],
      },
      recommendedRoles: ['Junior Developer', 'Intern'],
      levelAssessment: 'Beginner — solid foundation, needs guided practice',
      confidenceSummary: 'You show potential but need structured project work.',
    };
  }

  const qaFormatted = questions.map((q) => {
    const answer = answers[q.id] || answers[String(q.id)] || 'Not answered';
    return `Q${q.id} [${q.type}, ${q.difficulty}]: ${q.question}\nAnswer: ${answer}`;
  }).join('\n\n');

  const prompt = `
You are a senior career evaluator assessing a student for "${profile.targetDomain}".

Student profile:
- Skill level claimed: ${profile.skillLevel}
- Education: ${profile.educationType === 'school' ? `Class ${profile.classLevel}` : `${profile.degree}, ${profile.yearSemester}`}
- Stream: ${profile.stream || 'N/A'}
- Interests: ${profile.interests?.join(', ') || 'N/A'}
- Custom goals: ${profile.customInstructions || 'None'}

Questions and Answers:
${qaFormatted}

Evaluate thoroughly. Be honest and specific — no generic feedback.

Return ONLY valid JSON:
{
  "analysis": {
    "strengths": ["specific strength 1", "specific strength 2"],
    "weaknesses": ["specific weakness 1", "specific weakness 2"],
    "skillGaps": ["gap 1", "gap 2", "gap 3"]
  },
  "recommendedRoles": ["Role 1", "Role 2", "Role 3"],
  "levelAssessment": "One sentence honest assessment of their true current level",
  "confidenceSummary": "2-3 sentences: where they are, what's holding them back, what they should do next"
}
`.trim();

  return withRetry(async () => {
    const model = getModel();
    const result = await model.generateContent(prompt);
    return extractJSON(result.response.text());
  });
};

// ─── 3. Generate Full Personalized Roadmap ───────────────────────────────────

const generateFullRoadmap = async ({ profile, analysis }) => {
  if (USE_MOCK) {
    return {
      roadmap: {
        phase1: ['Learn core fundamentals of your domain', 'Complete one beginner project'],
        phase2: ['Build 2 real-world projects', 'Learn industry tools'],
        phase3: ['Build portfolio', 'Apply for internships'],
      },
      timelineEstimate: '6–9 months at 2 hrs/day',
      careerStrategy: {
        internship: 'Apply after Phase 2 completion',
        freelancing: null,
        higherStudies: 'Consider after 1 year of experience',
        govtExam: null,
      },
      nextSteps: ['Start with Phase 1 today', 'Join an online community'],
    };
  }

  const studyCtx = profile.studyHoursPerDay
    ? `${profile.studyHoursPerDay} hours per day`
    : 'unspecified hours per day';

  const prompt = `
You are a senior career architect creating a personalized roadmap for a student.

Student profile:
- Name: ${profile.name || 'Student'}
- Education: ${profile.educationType === 'school' ? `School, Class ${profile.classLevel}` : `${profile.degree}, ${profile.yearSemester}`}
- Stream: ${profile.stream}
- Target domain: ${profile.targetDomain}
- Skill level: ${profile.skillLevel}
- Interests: ${profile.interests?.join(', ') || 'N/A'}
- Study time: ${studyCtx}
- Custom goals/constraints: ${profile.customInstructions || 'None'}
- Language preference: ${profile.languagePreference === 'hi' ? 'Hindi' : 'English'}

Assessment results:
- Strengths: ${analysis.strengths?.join(', ')}
- Weaknesses: ${analysis.weaknesses?.join(', ')}
- Skill gaps: ${analysis.skillGaps?.join(', ')}
- True level: ${analysis.levelAssessment}
- Recommended roles: ${analysis.recommendedRoles?.join(', ')}

Create a SPECIFIC, ACTIONABLE roadmap. Name real tools, real courses, real platforms.
Base the timeline on ${studyCtx}.
Consider the custom goals — if user mentioned freelancing, include that strategy. If govt job, include that.

Return ONLY valid JSON:
{
  "roadmap": {
    "phase1": [
      "Step with specific tool/course/resource",
      "Step with specific action",
      "Step with specific project to build"
    ],
    "phase2": [
      "Step ...",
      "Step ...",
      "Step ..."
    ],
    "phase3": [
      "Step ...",
      "Step ...",
      "Step ..."
    ]
  },
  "timelineEstimate": "X months at Y hours/day",
  "careerStrategy": {
    "internship": "...",
    "freelancing": "..." or null,
    "higherStudies": "..." or null,
    "govtExam": "..." or null,
    "portfolio": "..."
  },
  "nextSteps": [
    "Most important first action",
    "Second action",
    "Third action"
  ]
}
`.trim();

  return withRetry(async () => {
    const model = getModel();
    const result = await model.generateContent(prompt);
    return extractJSON(result.response.text());
  });
};

// ─── 4. Context-Aware Chat ────────────────────────────────────────────────────

const processChat = async ({ message, userProfile, analysis, roadmap, history = [] }) => {
  if (USE_MOCK) return `Based on your profile, I'd recommend focusing on ${userProfile.targetDomain || 'your domain'} fundamentals first. Keep going!`;

  const systemInstruction = `
You are PathSaga AI, a career advisor for ${userProfile.name || 'this student'}.

Student context:
- Domain: ${userProfile.targetDomain}
- Level: ${userProfile.skillLevel}
- Education: ${userProfile.educationType === 'school' ? `Class ${userProfile.classLevel}` : `${userProfile.degree}, ${userProfile.yearSemester}`}
- Goals: ${userProfile.customInstructions || 'None specified'}

Their assessment: ${analysis?.levelAssessment || 'Not yet assessed'}
Their strengths: ${analysis?.strengths?.join(', ') || 'Unknown'}
Their gaps: ${analysis?.skillGaps?.join(', ') || 'Unknown'}
Recommended roles: ${analysis?.recommendedRoles?.join(', ') || 'Unknown'}
Current roadmap phase 1: ${roadmap?.phase1?.slice(0, 2).join(', ') || 'Not generated yet'}

Rules:
- Be concise and specific — max 150 words per reply
- Reference their actual profile, domain, gaps, and roadmap
- No generic motivational responses
- Answer the question directly first, then add context
- Use simple language (student is ${userProfile.languagePreference === 'hi' ? 'Hindi-speaking' : 'English-speaking'})
`.trim();

  const geminiHistory = history.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  return withRetry(async () => {
    const model = getModel(systemInstruction);
    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(message);
    return result.response.text().trim();
  });
};

// ─── Exports ──────────────────────────────────────────────────────────────────

const llmService = {
  generateAssessmentQuestions,
  analyzeAssessmentAnswers,
  generateFullRoadmap,
  processChat,
};

export default llmService;
