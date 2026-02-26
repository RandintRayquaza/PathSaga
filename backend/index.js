import 'dotenv/config';



if (!process.env.GEMINI_API_KEY) {
  console.error('[FATAL] GEMINI_API_KEY is not set. Aborting.');
  process.exit(1);
}

import './src/config/firebase.js';
import app from './src/app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.setMaxListeners(20);
