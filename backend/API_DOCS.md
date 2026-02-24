# PafthSaga AI — API Documentation

## Base URL

```
http://localhost:5000
```

## Authentication

All protected routes require a Firebase ID Token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

Obtain the token on the client side using the Firebase JS SDK:

```js
const token = await auth.currentUser.getIdToken();
```

## Standard Response Format

All endpoints return:

```json
{
  "success": true | false,
  "message": "Human-readable message",
  "data": { ... } | null
}
```

## Error Format

```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

---

## Auth Routes — `/api/auth`

### POST `/api/auth/register`

Syncs Firebase user into Firestore on first login. Safe to call on every login (idempotent).

**Auth:** Required

**Response 201:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "uid": "firebase-uid",
    "name": "John Doe",
    "email": "john@example.com",
    "class": null,
    "stream": null,
    "language": "en",
    "careerFitScore": null,
    "createdAt": "2026-02-24T06:51:00.000Z",
    "updatedAt": "2026-02-24T06:51:00.000Z"
  }
}
```

---

### GET `/api/auth/me`

Returns the logged-in user's Firestore profile.

**Auth:** Required

**Response 200:**

```json
{
  "success": true,
  "message": "Profile retrieved",
  "data": { "uid": "...", "name": "...", "email": "...", ... }
}
```

---

### PUT `/api/auth/update-profile`

Updates user profile fields.

**Auth:** Required

**Request Body:**

```json
{
  "name": "Jane Doe",
  "class": "12",
  "stream": "Science",
  "language": "hi"
}
```

**Response 200:**

```json
{ "success": true, "message": "Profile updated", "data": { ... } }
```

---

### DELETE `/api/auth/delete-account`

Deletes the user's Firestore record.

**Auth:** Required

**Response 200:**

```json
{ "success": true, "message": "Account deleted successfully", "data": null }
```

---

## Assessment Routes — `/api/assessment`

### POST `/api/assessment/start`

Initializes a blank assessment document for the user.

**Auth:** Required

**Response 201:**

```json
{
  "success": true,
  "message": "Assessment started",
  "data": {
    "id": "firestoreDocId",
    "userId": "firebase-uid",
    "logicalScore": null,
    "creativeScore": null,
    "verbalScore": null,
    "interestTags": [],
    "completedAt": null
  }
}
```

---

### POST `/api/assessment/submit`

Submits assessment scores and marks it complete.

**Auth:** Required

**Request Body:**

```json
{
  "logicalScore": 75,
  "creativeScore": 88,
  "verbalScore": 65,
  "interestTags": ["technology", "design", "entrepreneurship"]
}
```

**Response 200:**

```json
{ "success": true, "message": "Assessment submitted successfully", "data": { ... } }
```

---

### GET `/api/assessment/:userId`

Retrieves a user's assessment. Users can only access their own.

**Auth:** Required

**Response 200:**

```json
{ "success": true, "message": "Assessment retrieved", "data": { ... } }
```

---

## Career Routes — `/api/career`

### POST `/api/career/generate`

Triggers the hybrid AI pipeline:

1. Fetches user profile + assessment from Firestore
2. Calls Python scoring engine (falls back gracefully if offline)
3. Calls Gemini LLM with merged context
4. Saves `careerRecommendation` + `roadmap` to Firestore
5. Updates `careerFitScore` on user document

**Auth:** Required

**Response 200:**

```json
{
  "success": true,
  "message": "Career recommendation generated successfully",
  "data": {
    "id": "recDocId",
    "userId": "firebase-uid",
    "recommendedCareers": [
      "UX Designer",
      "Product Manager",
      "Frontend Developer"
    ],
    "fitPercentage": 84,
    "missingSkills": ["User Research", "SQL", "System Design"],
    "explanation": "Based on your strong creative and verbal scores...",
    "roadmapId": "roadmapDocId",
    "source": "hybrid",
    "generatedAt": "2026-02-24T06:51:00.000Z"
  }
}
```

---

### GET `/api/career/:userId`

Retrieves the most recent career recommendation.

**Auth:** Required (own data only)

**Response 200:**

```json
{ "success": true, "message": "Career recommendation retrieved", "data": { ... } }
```

---

## Roadmap Routes — `/api/roadmap`

### POST `/api/roadmap/generate`

Generates a 3-phase learning roadmap for a specific career goal using Gemini.

**Auth:** Required

**Request Body:**

```json
{ "careerGoal": "UX Designer" }
```

**Response 201:**

```json
{
  "success": true,
  "message": "Roadmap generated successfully",
  "data": {
    "id": "roadmapDocId",
    "userId": "firebase-uid",
    "phase1": [
      "Learn Figma basics",
      "Study color theory",
      "Complete UI course"
    ],
    "phase2": ["Build 3 portfolio projects", "Learn user research methods"],
    "phase3": ["Apply for internships", "Contribute to open-source UI kits"],
    "progressPercentage": 0,
    "currentPhase": 1
  }
}
```

---

### GET `/api/roadmap/:userId`

Retrieves the most recent roadmap.

**Auth:** Required (own data only)

---

### PUT `/api/roadmap/progress`

Updates progress on an existing roadmap.

**Auth:** Required

**Request Body:**

```json
{
  "roadmapId": "roadmapDocId",
  "progressPercentage": 45,
  "currentPhase": 2
}
```

**Response 200:**

```json
{ "success": true, "message": "Progress updated", "data": { ... } }
```

---

## Voice Route — `/api/voice`

### POST `/api/voice/process`

Accepts transcribed speech text, queries Gemini and Python in parallel, saves the interaction.

**Auth:** Required

**Request Body:**

```json
{ "speechText": "What career should I choose if I like coding and design?" }
```

**Response 200:**

```json
{
  "success": true,
  "message": "Voice query processed successfully",
  "data": {
    "id": "voiceDocId",
    "userId": "firebase-uid",
    "speechText": "What career should I choose if I like coding and design?",
    "llmResponse": "Based on your interests in both coding and design, you'd excel as a UI/UX Engineer or a Full-Stack Developer...",
    "pythonScore": 0.82,
    "audioResponseUrl": null,
    "createdAt": "2026-02-24T06:51:00.000Z"
  }
}
```

---

## Health Check

### GET `/health`

No auth required.

**Response 200:**

```json
{ "success": true, "message": "Server is healthy", "data": null }
```

---

## Firestore Collections Summary

| Collection              | Document ID  | Key Fields                                                                      |
| ----------------------- | ------------ | ------------------------------------------------------------------------------- |
| `users`                 | Firebase UID | uid, name, email, class, stream, language, careerFitScore                       |
| `assessments`           | Auto         | userId, logicalScore, creativeScore, verbalScore, interestTags[]                |
| `careerRecommendations` | Auto         | userId, recommendedCareers[], fitPercentage, missingSkills[], roadmapId, source |
| `roadmaps`              | Auto         | userId, phase1[], phase2[], phase3[], progressPercentage, currentPhase          |
| `voiceInteractions`     | Auto         | userId, speechText, llmResponse, pythonScore                                    |

---

## Environment Variables

| Variable                | Required | Description                                          |
| ----------------------- | -------- | ---------------------------------------------------- |
| `PORT`                  | No       | Server port (default: 5000)                          |
| `NODE_ENV`              | No       | `development` or `production`                        |
| `FIREBASE_PROJECT_ID`   | ✅       | Firebase project ID                                  |
| `FIREBASE_CLIENT_EMAIL` | ✅       | Firebase service account email                       |
| `FIREBASE_PRIVATE_KEY`  | ✅       | Firebase private key (no quotes, literal `\n`)       |
| `LLM_PROVIDER`          | No       | `gemini` (default)                                   |
| `GEMINI_API_KEY`        | ✅       | Gemini API key                                       |
| `PYTHON_SERVICE_URL`    | No       | Python engine URL (default: `http://localhost:8000`) |
| `ALLOWED_ORIGINS`       | No       | Comma-separated CORS origins                         |
