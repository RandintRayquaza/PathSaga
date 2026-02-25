import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import api from './utils/api';
import { loginSuccess, logout } from './redux/slices/authSlice';
import AppRouter from './routes/AppRouter';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const dispatch = useDispatch();
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          dispatch(loginSuccess({ 
            token, 
            uid: user.uid, 
            email: user.email, 
            name: user.displayName 
          }));

          // Fetch full profile from backend to sync avatar/details
          const res = await api.get('/api/auth/me');
          if (res.data?.success) {
            dispatch(loginSuccess({ ...res.data.data, token }));
          }
        } catch (err) {
          console.error("Session recovery failed:", err);
          dispatch(logout());
        }
      } else {
        // No user found, clear state
        dispatch(logout());
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
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
