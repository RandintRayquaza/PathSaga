import { Link } from 'react-router-dom';

const cols = {
  'Product':  [{ to: '/#features', l: 'Features' }, { to: '/#how-it-works', l: 'How It Works' }, { to: '/assessment', l: 'Assessment' }],
  'Company':  [{ to: '/#why', l: 'Why PathSaga' }, { to: '/#mission', l: 'Mission' }],
  'Account':  [{ to: '/login', l: 'Log In' }, { to: '/signup', l: 'Sign Up' }],
};

export default function Footer() {
  return (
    <footer className="border-t border-ink-800 bg-ink-950 pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-display text-lg text-ink-50">
              Path<span className="text-lime-400">Saga</span>
            </Link>
            <p className="mt-3 text-sm text-ink-400 leading-relaxed">
              AI-powered career clarity for every student and professional.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(cols).map(([section, items]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-500 mb-3">{section}</h3>
              <ul className="space-y-2">
                {items.map(({ to, l }) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-ink-400 hover:text-lime-400 transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-ink-800 pt-6 text-center text-xs text-ink-600">
          © {new Date().getFullYear()} PathSaga AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
