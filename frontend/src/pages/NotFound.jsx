import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-ink-950 flex flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-[120px] leading-none text-ink-800 select-none">404</p>
      <h1 className="font-display text-2xl text-ink-100 mb-2 -mt-4">{t('notfound.title')}</h1>
      <p className="text-ink-400 text-sm mb-8 max-w-xs">{t('notfound.desc')}</p>
      <Link to="/" className="inline-flex items-center gap-2 bg-lime-400 text-ink-950 font-semibold text-sm px-6 py-3 rounded-full hover:bg-lime-300 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t('notfound.btn_home')}
      </Link>
    </div>
  );
}
