import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Compass, Sparkles, User } from 'lucide-react';

import { useTranslation } from 'react-i18next';
import { Settings } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, labelKey: 'nav.home' },
  { to: '/assessment',icon: Compass,         labelKey: 'nav.path' },
  { to: '/aichat',    icon: Sparkles,        labelKey: 'nav.coach' },
  { to: '/profile',   icon: User,            labelKey: 'nav.profile' },
  { to: '/settings',  icon: Settings,        labelKey: 'nav.settings' },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-900 px-2 pb-safe z-50">
      <ul className="flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ to, icon: Icon, labelKey }) => {
          const isActive = pathname.startsWith(to);
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                  isActive ? 'text-violet-400' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'fill-violet-400/20 stroke-[1.5]' : 'stroke-2'}`} />
                <span className="text-[10px] font-medium tracking-wide">{t(labelKey)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
