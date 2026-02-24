import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/slices/authSlice';
import { useTranslation } from 'react-i18next';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebase';
import api from '../utils/api';

import FormField    from '../components/ui/FormField';
import Button       from '../components/ui/Button';
import GoogleButton from '../components/ui/GoogleButton';

export default function Signup() {
  const { t } = useTranslation();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm]     = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.name)               e.name     = t('auth.err_name');
    if (!form.email)              e.email    = t('auth.err_email');
    if (form.password.length < 6) e.password = t('auth.err_password');
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    dispatch(loginStart());
    try {
      // 1. Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      
      // Optional: Add display name to firebase profile
      await updateProfile(userCredential.user, { displayName: form.name });

      // 2. Get ID token and sync provisional data to Redux (so interceptor works)
      const token = await userCredential.user.getIdToken();
      dispatch(loginSuccess({ token, uid: userCredential.user.uid, email: form.email, name: form.name }));

      // 3. Call backend register route
      const response = await api.post('/api/auth/register', {
        name: form.name,
        email: form.email
      });

      // 4. Save returned user profile in Redux
      dispatch(loginSuccess({ ...response.data.data, token }));
      
      // 5. Redirect to onboarding
      navigate('/onboarding');
    } catch (err) {
      console.error('Signup Error:', err);
      dispatch(loginFailure(err.response?.data?.message || err.message || t('auth.err_general')));
    }
  };

  const handleGoogleAuth = async () => {
    dispatch(loginStart());
    setErrors({});
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const token = await userCredential.user.getIdToken();
      
      dispatch(loginSuccess({ token, uid: userCredential.user.uid, email: userCredential.user.email, name: userCredential.user.displayName }));

      const response = await api.post('/api/auth/register', {
        name: userCredential.user.displayName || 'User',
        email: userCredential.user.email
      });

      dispatch(loginSuccess({ ...response.data.data, token }));
      navigate('/onboarding');
    } catch (err) {
      console.error('Google Signup Error:', err);
      dispatch(loginFailure(err.response?.data?.message || err.message || t('auth.err_general')));
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-2xl text-ink-50">
            Path<span className="text-lime-400">Saga</span>
          </Link>
          <h1 className="font-display text-2xl text-ink-50 mt-5">{t('auth.signup_title')}</h1>
          <p className="text-sm text-ink-400 mt-1">{t('auth.signup_subtitle')}</p>
        </div>

        {/* Card */}
        <div className="bg-ink-900 border border-ink-700 rounded-2xl p-6">

          {/* Google */}
          <GoogleButton onClick={handleGoogleAuth} label={t('auth.btn_google')} />

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-ink-700" />
            <span className="text-xs text-ink-500">{t('auth.lbl_or_email')}</span>
            <div className="flex-1 h-px bg-ink-700" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <FormField id="name"     label={t('auth.lbl_name')}     type="text"     value={form.name}     onChange={set('name')}     error={errors.name}     placeholder={t('auth.plh_name')}    />
            <FormField id="email"    label={t('auth.lbl_email')}    type="email"    value={form.email}    onChange={set('email')}    error={errors.email}    placeholder={t('auth.plh_email')} />
            <FormField id="password" label={t('auth.lbl_password')} type="password" value={form.password} onChange={set('password')} error={errors.password} placeholder={t('auth.plh_password')} />

            {error && <p className="text-sm text-red-400 text-center">{error}</p>}

            <Button className="w-full" size="lg" disabled={loading}>
              {loading ? t('auth.btn_signing_up') : t('auth.btn_signup')}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-ink-500 mt-5">
          {t('auth.lbl_has_account')}{' '}
          <Link to="/login" className="text-lime-400 hover:underline font-medium">{t('auth.lnk_signin')}</Link>
        </p>
        <p className="text-center text-xs text-ink-600 mt-3">
          {t('auth.terms')}
        </p>
      </div>
    </div>
  );
}
