import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Compass, Sparkles, User, Settings, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/assessment',icon: Compass,         label: 'Path Assessment' },
  { to: '/aichat',    icon: Sparkles,        label: 'AI Coach' },
];

const PREF_ITEMS = [
  { to: '/profile',   icon: User,            label: 'Profile' },
  { to: '/settings',  icon: Settings,        label: 'Settings' },
];

function NavLink({ to, icon: Icon, label }) {
  const { pathname } = useLocation();
  const isActive = pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
        isActive
          ? 'bg-zinc-800/80 text-zinc-50 font-medium'
          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
      }`}
    >
      <Icon className={`w-4 h-4 ${isActive ? 'text-violet-400' : ''}`} />
      {label}
    </Link>
  );
}

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <aside className="hidden lg:flex flex-col w-[240px] fixed top-0 left-0 bottom-0 bg-zinc-950 border-r border-zinc-900 overflow-y-auto">
      <div className="p-6">
        <Link to="/" className="font-display text-xl font-bold text-zinc-50 tracking-tight">
          Path<span className="text-violet-500">Saga</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-8">
        <div>
          <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-2">My Path</p>
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => <NavLink key={item.to} {...item} />)}
          </div>
        </div>

        <div>
          <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-2">Preferences</p>
          <div className="space-y-1">
            {PREF_ITEMS.map((item) => <NavLink key={item.to} {...item} />)}
          </div>
        </div>
      </nav>

      <div className="p-3 border-t border-zinc-900 mt-auto">
        <button
          onClick={() => {
            dispatch(logout());
            navigate('/');
          }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40 transition-colors cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
