import { callGemini } from './geminiService.js';
import { acquireLock, releaseLock } from './requestLock.js';

const USE_MOCK = process.env.USE_MOCK_LLM === 'true';

// ─── Direct Request Execution (No Global Queue) ───────────────────────────────────

const executeDirectRequest = async (userId, taskId, prompt, { systemInstruction = null, history = null, isMock = false, mockResponse = null, languageRulesOpts = {} } = {}) => {
  
  // 1. In-Flight Lock checking
  if (!acquireLock(userId)) {
    const err = new Error('A request is already in progress. Please wait.');
    err.statusCode = 429;
    throw err;
  }

  try {
    console.log(`\n\n[EXEC][${new Date().toISOString()}] Executing Gemini for User ${userId} | Task: ${taskId}`);

    if (USE_MOCK || isMock) {
      await new Promise(r => setTimeout(r, 1000));
      return mockResponse;
    }

    // Attempt direct Gemini Call
    const result = await callGemini(prompt, { 
      userId, 
      route: taskId,
      systemInstruction,
      history
    });

    if (!result.success) {
      const err = new Error(result.error);
      err.statusCode = result.code === 'RATE_LIMITED' ? 429 : 503;
      err.code = result.code;
      throw err;
    }

    let textOutput = result.data?.trim();
    if (languageRulesOpts.lang && languageRulesOpts.validate) {
      validateLanguagePurity(textOutput, languageRulesOpts.lang);
    }
    return languageRulesOpts.parseJSON ? extractJSON(textOutput) : textOutput;

  } finally {
    releaseLock(userId);
  }
};

// ─── JSON parse helper ───────────────────────────────────────────────────────
const extractJSON = (text) => {
  if (!text) return {};
  const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
  try {
    return JSON.parse(clean);
  } catch {
    const match = clean.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Gemini returned non-JSON response');
    return JSON.parse(match[0]);
  }
};

// ─── Language Validation Helper ──────────────────────────────────────────────
const validateLanguagePurity = (text, requestedLanguage) => {
  if (requestedLanguage !== 'hi') return; // Only validate Hindi strictness for now
  const hindiChars = (text.match(/[\u0900-\u097F]/g) || []).length;
  const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
  const totalChars = hindiChars + englishChars;
  if (totalChars === 0) return;
  const englishRatio = englishChars / totalChars;
  if (englishRatio > 0.40) {
    throw new Error('LANGUAGE_VALIDATION_FAILED: LLM generated too much English instead of Hindi.');
  }
};

// ─── Centralized Exported Methods ────────────────────────────────────────────

const generateAssessmentQuestions = async ({ userId, profile }) => {
  const langRules = profile.languagePreference === 'hi' 
    ? `CRITICAL INSTRUCTION: Generate ALL text output, including questions and options, strictly in Hindi (Devanagari script). Do NOT mix English unless technically required for code terminology.`
    : `CRITICAL INSTRUCTION: Generate all output strictly in English.`;

  const prompt = `You are an expert technical assessor for ${profile.targetDomain || 'software development'}.
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
- ${langRules}

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
}`;

  return executeDirectRequest(userId, 'generateAssessmentQuestions', prompt, {
    mockResponse: {
      questions: [
        { id: 1, question: 'What does HTML stand for?', type: 'mcq', difficulty: 'easy', options: ['HyperText Markup Language', 'HyperTool Markup Logic', 'HighText Machine Language', 'None of these'] },
        { id: 2, question: 'Explain the difference between == and === in JavaScript.', type: 'short-answer', difficulty: 'medium' },
      ],
    },
    languageRulesOpts: { lang: profile.languagePreference, validate: true, parseJSON: true }
  });
};

const processAssessmentAndRoadmap = async ({ userId, profile, questions, answers }) => {
  const qaFormatted = questions.map((q) => {
    const answer = answers[q.id] || answers[String(q.id)] || 'Not answered';
    return `Q${q.id} [${q.type}, ${q.difficulty}]: ${q.question}\nAnswer: ${answer}`;
  }).join('\n\n');

  const studyCtx = profile.studyHoursPerDay ? `${profile.studyHoursPerDay} hours per day` : 'unspecified hours per day';

  const langRules = profile.languagePreference === 'hi' 
    ? `CRITICAL INSTRUCTION: Generate ALL arrays, summaries, and phases strictly in Hindi (Devanagari script). Technical terms can be English.`
    : `CRITICAL INSTRUCTION: Generate all arrays, summaries, and phases strictly in English.`;

  const prompt = `You are a senior career evaluator and architect assessing a student for "${profile.targetDomain}".

Student profile:
- Skill level claimed: ${profile.skillLevel}
- Education: ${profile.educationType === 'school' ? `Class ${profile.classLevel}` : `${profile.degree}, ${profile.yearSemester}`}
- Stream: ${profile.stream || 'N/A'}
- Interests: ${profile.interests?.join(', ') || 'N/A'}
- Study time: ${studyCtx}
- Custom goals/constraints: ${profile.customInstructions || 'None'}
- Language preference: ${profile.languagePreference === 'hi' ? 'Hindi' : 'English'}

Questions and Answers:
${qaFormatted}

Your task is to thoroughly analyze these answers, evaluate true skill level, and immediately generate a specific, actionable 3-phase roadmap using real tools and courses.

${langRules}

Return ONLY valid JSON with this exact structure:
{
  "analysis": {
    "strengths": ["specific strength 1", "specific strength 2"],
    "weaknesses": ["specific weakness 1", "specific weakness 2"],
    "skillGaps": ["gap 1", "gap 2", "gap 3"]
  },
  "recommendedRoles": ["Role 1", "Role 2", "Role 3"],
  "levelAssessment": "One sentence honest assessment of their true current level",
  "confidenceSummary": "2-3 sentences: where they are, what's holding them back, what they should do next",
  "roadmap": {
    "phase1": ["Step with specific tool/course/resource", "Step with specific action", "Step with specific project"],
    "phase2": ["Step ..."],
    "phase3": ["Step ..."]
  },
  "timelineEstimate": "X months at Y hours/day",
  "careerStrategy": {
    "internship": "...",
    "freelancing": null,
    "higherStudies": null,
    "govtExam": null,
    "portfolio": "..."
  },
  "nextSteps": ["Most important first action", "Second action"]
}`;

  return executeDirectRequest(userId, 'processAssessmentAndRoadmap', prompt, {
    mockResponse: {
      analysis: { strengths: ['Basic fundamentals'], weaknesses: ['Lacks practical experience'], skillGaps: ['No hands-on'] },
      recommendedRoles: ['Junior Developer', 'Intern'],
      levelAssessment: 'Beginner',
      confidenceSummary: 'Good potential.',
      roadmap: { phase1: ['Start Phase 1'], phase2: ['Phase 2'], phase3: ['Phase 3'] },
      timelineEstimate: '6-9 months',
      nextSteps: ['Start Phase 1'],
      careerStrategy: {}
    },
    languageRulesOpts: { lang: profile.languagePreference, validate: true, parseJSON: true }
  });
};

const processChat = async ({ userId, message, userProfile, analysis, roadmap, history = [] }) => {
  const langRules = userProfile.languagePreference === 'hi'
    ? `CRITICAL: Generate ALL your chat responses STRICTLY in Hindi (Devanagari script). Do NOT mix English unless technically required for code or tool names.`
    : `CRITICAL: Generate ALL your chat responses strictly in English.`;

  const systemInstruction = `You are PathSaga AI, a career advisor for ${userProfile.name || 'this student'}.

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
- ${langRules}`;

  const geminiHistory = history.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  return executeDirectRequest(userId, 'processChat', message, {
    systemInstruction,
    history: geminiHistory,
    mockResponse: `Based on your profile, I'd recommend focusing on ${userProfile.targetDomain || 'your domain'} fundamentals first. Keep going!`,
    languageRulesOpts: { lang: userProfile.languagePreference, validate: true, parseJSON: false }
  });
};

const generateCareerRecommendation = async ({ userId, userProfile, assessmentScores, pythonResult }) => {
  const prompt = `Provide career recommendations for this student. Return JSON { "recommendedCareers": [...], "missingSkills": [...], "fitPercentage": 85, "explanation": "..."}`;
  return executeDirectRequest(userId, 'generateCareerRecommendation', prompt, {
    mockResponse: { recommendedCareers: ['Software Engineer'], missingSkills: ['React', 'Node'], fitPercentage: 80, explanation: 'Good fit.' },
    languageRulesOpts: { parseJSON: true }
  });
};

const generateRoadmap = async ({ userId, userProfile, careerGoal }) => {
  const prompt = `Provide a roadmap. Return JSON { "phase1": [...], "phase2": [...], "phase3": [...] }`;
  return executeDirectRequest(userId, 'generateRoadmap', prompt, {
    mockResponse: { phase1: [], phase2: [], phase3: [] },
    languageRulesOpts: { parseJSON: true }
  });
};

const generatePhaseTodos = async ({ userId, userProfile, roadmap, phaseNumber }) => {
  const phaseKey = `phase${phaseNumber}`;
  const targetPhaseContent = roadmap[phaseKey] || [];
  
  const roadmapLang = roadmap.language || userProfile.languagePreference || 'en';
  const langRules = roadmapLang === 'hi'
    ? `CRITICAL INSTRUCTION: Generate the task 'title' and 'description' fields strictly in Hindi (Devanagari script). Do NOT use English unless it is a tool name.`
    : `CRITICAL INSTRUCTION: Generate all output strictly in English.`;

  const prompt = `You are a technical mentor for ${userProfile.targetDomain}.
Your student needs practical, actionable tasks based on Phase ${phaseNumber} of their roadmap.

Roadmap Phase ${phaseNumber}:
${JSON.stringify(targetPhaseContent, null, 2)}

Provide EXACTLY 10 highly actionable tasks they need to do to complete this ENTIRE phase.
${langRules}

Format each task strictly as follows:
{
  "title": "Short, actionable title (e.g. Build a Hello World API)",
  "description": "1-2 sentences explaining exactly what to do and how to verify it."
}

Return ONLY valid JSON like this:
{
  "todos": [
    { "title": "Task 1", "description": "..." },
    { "title": "Task 2", "description": "..." },
    ... exactly 10 tasks ...
  ]
}`;

  return executeDirectRequest(userId, `generatePhaseTodos_Phase${phaseNumber}`, prompt, {
    mockResponse: {
      todos: [
        { title: 'Setup Environment', description: 'Install Node and IDE' },
        { title: 'Read Docs', description: 'Read official documentation' }
      ]
    },
    languageRulesOpts: { lang: roadmapLang, validate: true, parseJSON: true }
  });
};

const llmController = {
  generateAssessmentQuestions,
  processAssessmentAndRoadmap,
  processChat,
  generateCareerRecommendation,
  generateRoadmap,
  generatePhaseTodos
};

export default llmController;
