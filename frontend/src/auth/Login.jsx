import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebase';
import api from '../utils/api';
import { loginStart, loginSuccess, loginFailure } from '../redux/slices/authSlice';

import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import GoogleButton from '../components/ui/GoogleButton';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();


const [form, setForm] = useState({
  email: '',
  password: '',
});

const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError(t('auth.err_fields', { defaultValue: 'Please fill in all fields.' }));
      return;
    }

    setLoading(true);
    setError('');
    dispatch(loginStart());

    try {
      // 1. Authenticate using Firebase
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      
     
      const token = await userCredential.user.getIdToken();
      dispatch(loginSuccess({ token, uid: userCredential.user.uid, email: userCredential.user.email }));

      // 3. Call backend GET /api/auth/me to get the expanded DB profile
      const response = await api.get('/api/auth/me'); // axios handles the baseURL and the Bearer token injection
      
      // 4. Update Redux with full backend profile
      dispatch(loginSuccess({ ...response.data.data, token }));
      
      // 5. Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login Error:', err);
      setError(err.response?.data?.message || err.message || t('auth.err_general'));
      dispatch(loginFailure(err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    dispatch(loginStart());

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const token = await userCredential.user.getIdToken();
      
      dispatch(loginSuccess({ token, uid: userCredential.user.uid, email: userCredential.user.email }));

      // Call backend GET /api/auth/me to get the expanded DB profile
      const response = await api.get('/api/auth/me'); 
      
      dispatch(loginSuccess({ ...response.data.data, token }));
      navigate('/dashboard');
    } catch (err) {
      console.error('Google Login Error:', err);
      setError(err.response?.data?.message || err.message || t('auth.err_general'));
      dispatch(loginFailure(err.message));
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 py-16">

    <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">

      {/* LEFT SIDE */}
      <div className="hidden lg:block space-y-6">
        <Link to="/" className="text-3xl font-display text-neutral-100">
          Path<span className="text-lime-400">Saga</span>
        </Link>

        <h1 className="text-4xl font-display text-neutral-100 leading-tight">
          {t('auth.login_hero_title', 'Continue building')}
          <br />
          <span className="text-lime-400">{t('auth.login_hero_subtitle', 'your future.')}</span>
        </h1>

        <p className="text-neutral-400 max-w-md">
          {t('auth.login_hero_desc', 'Access your personalized roadmap and continue your journey toward career clarity.')}
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full max-w-md mx-auto   ">

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl  flex flex-col justify-center p-10 ">

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="text-2xl font-display text-neutral-100">
              Path<span className="text-lime-400">Saga</span>
            </Link>
          </div>

          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-2xl font-display text-neutral-100">
              {t('auth.login_welcome', 'Welcome back')}
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              {t('auth.login_welcome_desc', 'Sign in to continue your journey')}
            </p>
          </div>

          <GoogleButton onClick={handleGoogleAuth} label={t('auth.btn_google', 'Continue with Google')} />

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-neutral-700" />
            <span className="text-xs text-neutral-500 uppercase tracking-wide">
              {t('auth.lbl_or_email', 'or continue with email')}
            </span>
            <div className="flex-1 h-px bg-neutral-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <FormField
              id="email"
              label={t('auth.lbl_email', 'Email')}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              placeholder="you@example.com"
            />

            <FormField
              id="password"
              label={t('auth.lbl_password', 'Password')}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
              placeholder="••••••••"
            />

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button className="w-full" size="lg" disabled={loading}>
              {loading ? t('auth.btn_signing_in', 'Signing in…') : t('auth.btn_signin', 'Sign In')}
            </Button>
          </form>

          <p className="text-center text-sm text-neutral-500 mt-6">
            {t('auth.lbl_no_account', "Don't have an account?")}{' '}
            <Link
              to="/signup"
              className="text-lime-400 hover:text-lime-300 font-medium"
            >
              {t('auth.lnk_signup', 'Sign up free')}
            </Link>
          </p>

        </div>
      </div>

    </div>
  </div>
  );
}