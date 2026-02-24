# PafthSaga AI — Postman Testing Guide

## Prerequisites

1. Backend running: `cd backend && npm run dev`
2. A Firebase ID Token (see Step 1 below)
3. Postman installed

---

## Step 1 — Get a Firebase ID Token

### Option A: Browser Console (fastest)

1. Open **Firebase Console → Authentication → Users** → Add a test user (Email/Password)
2. Get your **Web API Key**: Firebase Console → Project Settings → General → Your Apps
3. Open any browser tab → press **F12** → Console tab → paste:

```js
const r = await fetch(
  "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOUR_WEB_API_KEY",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "test@example.com",
      password: "yourpassword",
      returnSecureToken: true,
    }),
  },
);
const d = await r.json();
console.log(d.idToken);
```

4. Copy the `idToken` from the console output — this is your bearer token.

> Tokens expire after 1 hour. Re-run the snippet to get a fresh one.

---

## Step 2 — Set Up Postman

1. In Postman, create a new **Collection** called `PafthSaga AI`
2. Go to **Collection → Variables** and add:

| Variable   | Value                                                                   |
| ---------- | ----------------------------------------------------------------------- |
| `base_url` | `http://localhost:5000`                                                 |
| `token`    | _(paste your idToken here)_                                             |
| `uid`      | _(your Firebase user UID — shown in Firebase Console → Authentication)_ |

3. In **Collection → Authorization**, set:
   - Type: `Bearer Token`
   - Token: `{{token}}`

All requests in this collection will inherit the bearer token automatically.

---

## Step 3 — API Requests (test in this order)

---

### 0. Health Check

```
GET {{base_url}}/health
```

**No auth needed.**

Expected:

```json
{ "success": true, "message": "Server is healthy", "data": null }
```

---

### 1. Register User

```
POST {{base_url}}/api/auth/register
```

**Body:** none

Expected:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "uid": "...",
    "name": "Test User",
    "email": "test@example.com",
    "class": null,
    "stream": null,
    "language": "en",
    "careerFitScore": null
  }
}
```

---

### 2. Get My Profile

```
GET {{base_url}}/api/auth/me
```

---

### 3. Update Profile

```
PUT {{base_url}}/api/auth/update-profile
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "name": "Aryan Uchiya",
  "class": "12",
  "stream": "Science",
  "language": "en"
}
```

---

### 4. Start Assessment

```
POST {{base_url}}/api/assessment/start
```

**Body:** none

---

### 5. Submit Assessment

```
POST {{base_url}}/api/assessment/submit
Content-Type: application/json
```

**Body:**

```json
{
  "logicalScore": 75,
  "creativeScore": 85,
  "verbalScore": 70,
  "interestTags": ["technology", "design", "entrepreneurship"]
}
```

---

### 6. Get Assessment

```
GET {{base_url}}/api/assessment/{{uid}}
```

---

### 7. Generate Career Recommendation _(requires GEMINI_API_KEY)_

```
POST {{base_url}}/api/career/generate
```

**Body:** none

This calls **Gemini 1.5 Flash** — takes 3–8 seconds.

Expected:

```json
{
  "success": true,
  "message": "Career recommendation generated successfully",
  "data": {
    "recommendedCareers": [
      "UX Designer",
      "Product Manager",
      "Frontend Developer"
    ],
    "fitPercentage": 84,
    "missingSkills": ["User Research", "SQL"],
    "explanation": "Based on your scores...",
    "roadmapId": "...",
    "source": "llm"
  }
}
```

---

### 8. Get Career Recommendation

```
GET {{base_url}}/api/career/{{uid}}
```

---

### 9. Generate Roadmap

```
POST {{base_url}}/api/roadmap/generate
Content-Type: application/json
```

**Body:**

```json
{ "careerGoal": "UX Designer" }
```

---

### 10. Get Roadmap

```
GET {{base_url}}/api/roadmap/{{uid}}
```

---

### 11. Update Roadmap Progress

```
PUT {{base_url}}/api/roadmap/progress
Content-Type: application/json
```

**Body** _(use `roadmapId` from step 9 response)_:

```json
{
  "roadmapId": "paste-roadmap-doc-id-here",
  "progressPercentage": 33,
  "currentPhase": 2
}
```

---

### 12. Voice Query _(requires GEMINI_API_KEY)_

```
POST {{base_url}}/api/voice/process
Content-Type: application/json
```

**Body:**

```json
{ "speechText": "What career should I choose if I like coding and design?" }
```

---

## Common Errors

| Status | Message                  | Fix                                                               |
| ------ | ------------------------ | ----------------------------------------------------------------- |
| `401`  | No token provided        | Add `Authorization: Bearer <token>` header                        |
| `401`  | Invalid or expired token | Re-generate token (Step 1)                                        |
| `404`  | User not found           | Call `/api/auth/register` first                                   |
| `400`  | Assessment not found     | Call `/api/assessment/submit` first                               |
| `500`  | Gemini error             | Check `GEMINI_API_KEY` in `.env`                                  |
| `403`  | Not authorized           | You can only access your own data — `uid` in URL must match token |
