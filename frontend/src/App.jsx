import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import api from './utils/api';
import { loginSuccess, logout } from './redux/slices/authSlice';
import AppRouter from './routes/AppRouter';

export default function App() {
  const dispatch = useDispatch();

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
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
