import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes.js';
import assessmentRoutes from './routes/assessment.routes.js';
import careerRoutes from './routes/career.routes.js';
import roadmapRoutes from './routes/roadmap.routes.js';
import voiceRoutes from './routes/voice.routes.js';
import errorHandler from './middleware/errorHandler.middleware.js';

const app = express();

app.use(helmet());

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.', data: null },
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy', data: null });
});

app.use('/api/auth', authRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/voice', voiceRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', data: null });
});

app.use(errorHandler);

export default app;
