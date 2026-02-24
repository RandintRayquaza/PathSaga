import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const cols = {
  'footer.col_product':  [{ to: '/#features', l: 'footer.link_features' }, { to: '/#how-it-works', l: 'footer.link_how_it_works' }, { to: '/assessment', l: 'footer.link_assessment' }],
  'footer.col_company':  [{ to: '/#why', l: 'footer.link_why' }, { to: '/#mission', l: 'footer.link_mission' }],
  'footer.col_account':  [{ to: '/login', l: 'footer.link_login' }, { to: '/signup', l: 'footer.link_signup' }],
};

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-ink-800 bg-ink-950 pt-16 md:pt-24 pb-8 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16 mb-12 md:mb-16">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-display text-lg text-ink-50">
              Path<span className="text-lime-400">Saga</span>
            </Link>
            <p className="mt-3 text-sm text-ink-400 leading-relaxed">
              {t('footer.brand_desc')}
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(cols).map(([section, items]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-500 mb-3">{t(section)}</h3>
              <ul className="space-y-2">
                {items.map(({ to, l }) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-ink-400 hover:text-lime-400 transition-colors">{t(l)}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-ink-800 pt-8 text-center text-xs text-ink-600">
          {t('footer.rights', { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
