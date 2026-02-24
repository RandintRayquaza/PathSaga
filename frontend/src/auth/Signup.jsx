import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/slices/authSlice';
import FormField    from '../components/ui/FormField';
import Button       from '../components/ui/Button';
import GoogleButton from '../components/ui/GoogleButton';

export default function Signup() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm]     = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.name)               e.name     = 'Name is required';
    if (!form.email)              e.email    = 'Email is required';
    if (form.password.length < 6) e.password = 'Minimum 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    dispatch(loginStart());
    try {
      await new Promise((r) => setTimeout(r, 700)); /* Replace with real API */
      dispatch(loginSuccess({ email: form.email, name: form.name }));
      navigate('/onboarding');
    } catch {
      dispatch(loginFailure('Something went wrong. Please try again.'));
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
          <h1 className="font-display text-2xl text-ink-50 mt-5">Start your journey</h1>
          <p className="text-sm text-ink-400 mt-1">Free to use. No credit card needed.</p>
        </div>

        {/* Card */}
        <div className="bg-ink-900 border border-ink-700 rounded-2xl p-6">

          {/* Google */}
          <GoogleButton onClick={() => {}} label="Sign up with Google" />

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-ink-700" />
            <span className="text-xs text-ink-500">or continue with email</span>
            <div className="flex-1 h-px bg-ink-700" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <FormField id="name"     label="Full Name" type="text"     value={form.name}     onChange={set('name')}     error={errors.name}     placeholder="Alex Johnson"    />
            <FormField id="email"    label="Email"     type="email"    value={form.email}    onChange={set('email')}    error={errors.email}    placeholder="you@example.com" />
            <FormField id="password" label="Password"  type="password" value={form.password} onChange={set('password')} error={errors.password} placeholder="Min. 6 characters" />

            {error && <p className="text-sm text-red-400 text-center">{error}</p>}

            <Button className="w-full" size="lg" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Free Account'}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-ink-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-lime-400 hover:underline font-medium">Sign in</Link>
        </p>
        <p className="text-center text-xs text-ink-600 mt-3">
          By signing up you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
}
