import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../ui/LanguageSwitcher';

export default function Navbar() {
  const isAuth = useSelector((s) => s.auth.isAuthenticated);
  const { t } = useTranslation();

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold text-zinc-50 tracking-tight">
          Path<span className="text-violet-500">Saga</span>
        </Link>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {isAuth ? (
            <Link 
              to="/dashboard" 
              className="text-sm font-medium text-zinc-300 hover:text-zinc-50 transition-colors"
            >
              {t("nav.dashboard")} &rarr;
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 hidden sm:block">
                {t("nav.log_in")}
              </Link>
              <Link 
                to="/signup" 
                className="text-sm font-medium text-zinc-900 bg-zinc-50 hover:bg-zinc-200 px-4 py-2 rounded-full transition-colors"
              >
                {t("auth.btn_signup")}
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
