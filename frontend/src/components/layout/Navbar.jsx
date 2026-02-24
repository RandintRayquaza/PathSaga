import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { logout } from '../../redux/slices/authSlice';
import Button from '../ui/Button';

const NAV_LINKS = [
  { to: '/#features',      label: 'nav.features'     },
  { to: '/#how-it-works',  label: 'nav.how_it_works' },
  { to: '/#why',           label: 'nav.why_pathsaga' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const isAuth  = useSelector((s) => s.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = () => { dispatch(logout()); navigate('/'); };

  const toggleLanguage = () => {
    const nextLang = i18n.resolvedLanguage?.startsWith('en') ? 'hi' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-ink-950/80 backdrop-blur-md border-b border-ink-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between" aria-label="Main navigation">

        {/* Logo */}
        <Link to="/" className="font-display text-xl text-ink-50 tracking-tight">
          Path<span className="text-lime-400">Saga</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <Link to={to} className="text-sm text-ink-300 hover:text-lime-400 transition-colors">{t(label)}</Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          
          <button 
            onClick={toggleLanguage} 
            className="flex items-center justify-center w-8 h-8 rounded-full border border-ink-800 bg-ink-900 text-xs font-semibold text-ink-300 hover:text-lime-400 hover:border-lime-400/30 transition-colors mr-2"
            aria-label="Toggle language"
            title="Toggle language (EN/HI)"
          >
            {i18n.resolvedLanguage?.startsWith('en') ? 'HI' : 'EN'}
          </button>

          {isAuth ? (
            <>
              <Link to="/aichat" className="flex items-center gap-1.5 text-sm text-lime-400 font-medium hover:text-lime-300 transition-colors bg-lime-400/10 px-3 py-1.5 rounded-full border border-lime-400/20">
                {t('nav.ai_coach')}
              </Link>
              <Link to="/dashboard" className="text-sm text-ink-300 hover:text-lime-400 transition-colors">{t('nav.dashboard')}</Link>
              <Link to="/profile" className="text-sm text-ink-300 hover:text-lime-400 transition-colors">Profile</Link>
              <Button variant="secondary" size="sm" onClick={handleLogout}>{t('nav.sign_out')}</Button>
            </>
          ) : (
            <>
              <Link to="/login"  className="text-sm text-ink-300 hover:text-lime-400 transition-colors">{t('nav.log_in')}</Link>
              <Link to="/signup"><Button size="sm">{t('nav.get_started')}</Button></Link>
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
          
          <button 
            onClick={toggleLanguage} 
            className="text-left text-sm text-ink-300 hover:text-lime-400 font-semibold mb-2"
          >
            {t('nav.language')}: <span className="text-lime-400">{i18n.resolvedLanguage?.startsWith('en') ? t('nav.english') : t('nav.hindi')}</span>
          </button>

          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className="text-sm text-ink-300 hover:text-lime-400" onClick={() => setOpen(false)}>
              {t(label)}
            </Link>
          ))}
          {isAuth ? (
            <>
              <Link to="/aichat" className="text-left text-sm text-lime-400 font-medium" onClick={() => setOpen(false)}>{t('nav.ai_coach')}</Link>
              <Link to="/dashboard" className="text-left text-sm text-ink-300" onClick={() => setOpen(false)}>{t('nav.dashboard')}</Link>
              <Link to="/profile" className="text-left text-sm text-ink-300" onClick={() => setOpen(false)}>Profile</Link>
              <button onClick={handleLogout} className="text-left text-sm text-ink-400">{t('nav.sign_out')}</button>
            </>
          ) : (
            <Link to="/signup" onClick={() => setOpen(false)}>
              <Button className="w-full">{t('nav.get_started')}</Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
