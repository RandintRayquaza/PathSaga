import rateLimit from 'express-rate-limit';

export const assessmentLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1-minute window
  max: 5,                // 5 requests per user per minute
  keyGenerator: (req) => {
    // Use authenticated userId if available, fall back to IP
    return req.user?.uid || req.user?.id || req.headers['x-user-id'] || req.ip;
  },
  handler: (req, res) => {
    console.warn(`[RATE_LIMIT] userId=${req.user?.uid || req.user?.id || req.ip} hit limit`);
    res.status(429).json({
      success: false,
      error: 'Too many requests. Please wait 1 minute before trying again.',
      code: 'RATE_LIMITED',
      data: null
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});
