const userSchema = (data = {}) => ({
  uid: data.uid || null,
  name: data.name || null,
  email: data.email || null,

  // Education
  educationType: data.educationType || null,     // 'school' | 'college'
  classLevel: data.classLevel || null,           // '9' | '10' | '11' | '12' (school)
  degree: data.degree || null,                   // e.g. 'B.Tech' (college)
  yearSemester: data.yearSemester || null,       // e.g. '3rd Year' (college)
  specialization: data.specialization || null,   // e.g. 'CSE', 'Civil', 'Finance' (college branch)
  subSpecialization: data.subSpecialization || null, // e.g. 'AI/ML', 'Blockchain', 'IoT'

  // Career
  stream: data.stream || null,                   // Science | Commerce | Arts | Engineering | Other
  targetDomain: data.targetDomain || null,       // AI | Web Dev | UI/UX | Cybersecurity | Other
  customDomain: data.customDomain || null,       // free-text when targetDomain === 'Other'
  skillLevel: data.skillLevel || null,           // Beginner | Intermediate | Advanced
  interests: data.interests || [],               // array of strings

  // Preferences
  customInstructions: data.customInstructions || null,
  studyHoursPerDay: data.studyHoursPerDay || null,
  languagePreference: data.languagePreference || 'en',

  // State
  profileComplete: data.profileComplete || false,
  careerFitScore: data.careerFitScore || null,

  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export default userSchema;
