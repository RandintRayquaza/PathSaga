import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure } from '../redux/slices/authSlice';
import { auth, signInWithGoogle } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import GoogleButton from '../components/ui/GoogleButton';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithGoogle();
      const token = await result.user.getIdToken();
      const response = await api.post('/api/auth/google', { token, email: result.user.email });
      const backendToken = response.data.data.token;
      localStorage.setItem('token', backendToken);
    
      dispatch(loginSuccess({ ...response.data.data.user, token: backendToken }));
      navigate('/dashboard');
    } catch (err) {
      toast.error('Google Sign-Up failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!form.name || !form.email || !form.password) return setErrors({ name: !form.name ? 'Required' : '', email: !form.email ? 'Required' : '', password: !form.password ? 'Required' : '' });
    
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const token = await result.user.getIdToken();
      const response = await api.post('/api/auth/register', { ...form, token });
      const { user, token: backendToken } = response.data.data;
      localStorage.setItem('token', backendToken);
    
      dispatch(loginSuccess({ user, token: backendToken }));
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        toast.error('Email is already in use');
      } else {
        toast.error(err.response?.data?.message || err.message || 'Sign up failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-zinc-950 flex flex-row-reverse">
      {/* Right brand panel — desktop only */}
      <div className="hidden lg:flex flex-col justify-between px-16 py-12 flex-1 border-l border-zinc-900 bg-zinc-950/50">
        <div className="flex justify-end">
          <Link to="/" className="font-display text-2xl font-bold text-zinc-50">
            Path<span className="text-violet-500">Saga</span>
          </Link>
        </div>
        <div>
          <h1 className="font-display text-h1 text-zinc-50 mb-4 leading-[1.1]">
            Find your path.<br />
            <span className="text-zinc-500">We'll provide the map.</span>
          </h1>
        </div>
        <p className="text-sm text-zinc-600 tracking-wide uppercase">Join 10,000+ students</p>
      </div>

      {/* Left form panel */}
      <div className="flex flex-col justify-center items-center flex-1 px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-10">
            <Link to="/" className="font-display text-2xl font-bold text-zinc-50">
              Path<span className="text-violet-500">Saga</span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-zinc-50">Create account</h2>
            <p className="text-sm text-zinc-400 mt-2">Takes less than a minute.</p>
          </div>

          <div className="space-y-4">
            <GoogleButton onClick={handleGoogleAuth} label="Sign up with Google" />

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-zinc-900" />
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest">or email</span>
              <div className="flex-1 h-px bg-zinc-900" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField id="name" label="Full Name" type="text" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
              <FormField id="email" label="Email" type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
              <FormField id="password" label="Password" type="password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
              
              <Button className="w-full mt-2" size="lg" disabled={loading}>
                {loading ? 'Creating account…' : 'Create account'}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-zinc-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-zinc-300 hover:text-zinc-50 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
