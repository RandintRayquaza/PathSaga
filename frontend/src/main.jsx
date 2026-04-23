
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { store } from './redux/store';
import App from './App';
import './index.css';
import './i18n';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
    <Analytics />
    <SpeedInsights />
  </Provider>
);
