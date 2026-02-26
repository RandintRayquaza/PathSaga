import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from './utils/api';
import { loginSuccess, logout } from './redux/slices/authSlice';
import AppRouter from './routes/AppRouter';
import { Toaster } from 'react-hot-toast';
import i18n from './i18n'; 

export default function App() {
  const dispatch = useDispatch();
  const [isAuthReady, setIsAuthReady] = useState(false);

  const hasFetched = React.useRef(false);

  useEffect(() => {
    const verifySession = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      const token = localStorage.getItem('token');

      if (token) {
        try {
          const res = await api.get('/api/auth/me');
          if (res.data?.success) {
            const userData = res.data.data;
            dispatch(loginSuccess({ ...userData, token }));
            
            // Sync initial language from database preference
            if (userData.languagePreference && userData.languagePreference !== i18n.language) {
              i18n.changeLanguage(userData.languagePreference);
            }
          } else {
            dispatch(logout());
          }
        } catch (err) {
          console.error("Session recovery failed:", err);
          dispatch(logout());
        }
      } else {
        dispatch(logout());
      }
      setIsAuthReady(true);
    };

    verifySession();
  }, [dispatch]);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-violet-400 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRouter />
      <Toaster 
        position="top-center"
        toastOptions={{
          className: '!bg-zinc-800 !text-zinc-100 !border !border-zinc-700 !shadow-xl',
          success: { iconTheme: { primary: '#a3e635', secondary: '#171717' } },
        }}
      />
    </BrowserRouter>
  );
}
