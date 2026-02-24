import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X } from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import Button from '../ui/Button';

const NAV_LINKS = [
  { to: '/#features',      label: 'Features'     },
  { to: '/#how-it-works',  label: 'How It Works' },
  { to: '/#why',           label: 'Why PathSaga'  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const isAuth  = useSelector((s) => s.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => { dispatch(logout()); navigate('/'); };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-ink-950/80 backdrop-blur-md border-b border-ink-800">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between" aria-label="Main navigation">

        {/* Logo */}
        <Link to="/" className="font-display text-xl text-ink-50 tracking-tight">
          Path<span className="text-lime-400">Saga</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <Link to={to} className="text-sm text-ink-300 hover:text-lime-400 transition-colors">{label}</Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isAuth ? (
            <>
              <Link to="/dashboard" className="text-sm text-ink-300 hover:text-lime-400 transition-colors">Dashboard</Link>
              <Button variant="secondary" size="sm" onClick={handleLogout}>Sign Out</Button>
            </>
          ) : (
            <>
              <Link to="/login"  className="text-sm text-ink-300 hover:text-lime-400 transition-colors">Log In</Link>
              <Link to="/signup"><Button size="sm">Get Started</Button></Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 text-ink-300" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-ink-900 border-t border-ink-800 px-4 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className="text-sm text-ink-300 hover:text-lime-400" onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          {isAuth ? (
            <button onClick={handleLogout} className="text-left text-sm text-ink-400">Sign Out</button>
          ) : (
            <Link to="/signup" onClick={() => setOpen(false)}>
              <Button className="w-full">Get Started</Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
