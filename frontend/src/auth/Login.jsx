import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure } from '../redux/slices/authSlice';
import { auth, signInWithGoogle } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import GoogleButton from '../components/ui/GoogleButton';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
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
      toast.error('Google Sign-In failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!form.email || !form.password) return setErrors({ email: !form.email ? 'Required' : '', password: !form.password ? 'Required' : '' });
    
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, form.email, form.password);
      const token = await result.user.getIdToken();
      const response = await api.post('/api/auth/login', { token });
      const { user, token: backendToken } = response.data.data;
      localStorage.setItem('token', backendToken);
    
      dispatch(loginSuccess({ user, token: backendToken }));
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/invalid-credential') {
        toast.error('Invalid email or password');
      } else {
        toast.error(err.response?.data?.message || err.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-zinc-950 flex">
      {/* Left brand panel — desktop only */}
      <div className="hidden lg:flex flex-col justify-between px-16 py-12 flex-1 border-r border-zinc-900 bg-zinc-950/50">
        <Link to="/" className="font-display text-2xl font-bold text-zinc-50">
          Path<span className="text-violet-500">Saga</span>
        </Link>
        <div>
          <h1 className="font-display text-h1 text-zinc-50 mb-4 leading-[1.1]">
            Welcome back.<br />
            <span className="text-zinc-500">Pick up where you left off.</span>
          </h1>
        </div>
        <p className="text-sm text-zinc-600 tracking-wide uppercase">AI Career Guidance Platform</p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-col justify-center items-center flex-1 px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-10">
            <Link to="/" className="font-display text-2xl font-bold text-zinc-50">
              Path<span className="text-violet-500">Saga</span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-zinc-50">Sign in</h2>
            <p className="text-sm text-zinc-400 mt-2">Get back to your roadmap.</p>
          </div>

          <div className="space-y-4">
            <GoogleButton onClick={handleGoogleAuth} label="Sign in with Google" />

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-zinc-900" />
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest">or email</span>
              <div className="flex-1 h-px bg-zinc-900" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField id="email" label="Email" type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
              <FormField id="password" label="Password" type="password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
              
              <Button className="w-full mt-2" size="lg" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-zinc-500 mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-zinc-300 hover:text-zinc-50 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
