# PathSaga 
🚀 **PathSaga**  is a dynamic, AI-powered career and skill progression platform designed to analyze a user's skills and actively generate highly personalized learning roadmaps. By analyzing the user's responses, domain interests, and experience level, PathSaga constructs multi-phased roadmaps, complete with actionable, step-by-step tasks engineered by Google's Gemini LLM.

Live Demo:

- **Frontend** (Vercel): [https://path-saga.vercel.app](https://path-saga.vercel.app)
- **Backend** (Render): [https://pathsaga.onrender.com](https://pathsaga.onrender.com)

---

## ✨ Core Features

- **🧠 AI-Powered Skill Assessment:**
  Users complete dynamically generated technical assessments based on their target domain (e.g., Frontend, Backend, Data Science) and skill level.
- **🗺️ Personalized Learning Roadmaps (Sagas):**
  Based on the assessment, the AI generates a customized, multi-phase roadmap. Phases are locked sequentially, ensuring users master foundational concepts before advancing.
- **✅ Dynamic Task Generation:**
  Upon unlocking a phase, exactly 10 actionable micro-tasks are generated on-the-fly, giving users clear, attainable goals to check off.
- **💬 Context-Aware AI Career Chat:**
  A dedicated conversational AI assistant that retains the context of the user's current roadmap to offer personalized advice, debugging help, and guidance.
- **🌍 Bilingual Support (i18n):**
  Full localization routing enabling instant switching between English (en) and Hindi (hi) interfaces.
- **🔐 Secure Authentication:**
  Seamless Google OAuth and Email/Password flows powered by Firebase Authentication.

---

## 🛠️ Technology Stack

### Frontend 🖥️

- **Framework:** React 18 + Vite
- **Routing:** React Router DOM (v6)
- **State Management:** Redux Toolkit (`authSlice`, `assessmentSlice`, `chatSlice`)
- **Styling:** Tailwind CSS + Custom Animations & Glassmorphism UI
- **Icons:** Lucide React
- **Localization:** `i18next` & `react-i18next`
- **Deployment:** Vercel

### Backend ⚙️

- **Runtime Environment:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** Firebase Firestore (NoSQL Document DB)
- **AI Integration:** `@google/generative-ai` (Gemini 2.5 Flash API)
- **Security & Optimization:** `helmet`, `cors`, `express-rate-limit`
- **Authentication:** Firebase Admin SDK (JWT Validation)
- **Deployment:** Render

---

## 🏗️ Architecture & Security Highlights

1. **Centralized LLM Controller:** All AI invocations are routed through a streamlined, robust controller featuring 30-second hard timeouts, intelligent error classification (e.g., `RATE_LIMITED`, `AUTH_ERROR`), and automatic retry mechanisms to ensure high availability for AI generation.
2. **In-Flight Request Locks & Debouncing:** The backend employs in-memory User ID locking mechanisms and the frontend strictly uses `useRef` debouncing flags to completely eliminate double-click API spam and mitigate `HTTP 429 Too Many Requests` API quota limits.
3. **CORS Hardening:** Production API strictly curates whitelisted Vercel sub-domains directly bypassing environment spoofing vulnerabilities.
4. **Optimistic UI Updates:** Roadmap task completions are updated immediately overriding the UI state before pinging the database, making the interface feel lightning fast.

---

## 🚀 Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/RandintRayquaza/PathSaga.git
cd PathSaga
```

### 2. Backend Configuration

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file referencing the structure of `.env.example`:

   ```env
   PORT=5000
   NODE_ENV=development
   # Firebase Admin Keys (Generate from Firebase Console -> Project Settings -> Service Accounts)
   FIREBASE_PROJECT_ID=pathsaga-xxx
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@pathsaga.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMII..."

   # Gemini API Key
   GEMINI_API_KEY=AIzaSy...

   # Frontend URL for CORS
   ALLOWED_ORIGINS=http://localhost:5173
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Configuration

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
4. Start the frontend Vite development server:
   ```bash
   npm run dev
   ```

---

## 🤝 Contributing

Contributions, issues, and feature requests are always welcome!

_(Built with passion for next-gen scalable engineering! 🚀)_
