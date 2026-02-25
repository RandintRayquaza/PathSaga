import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-[120px] leading-none text-zinc-800 select-none">404</p>
      <h1 className="font-display text-2xl text-zinc-100 mb-2 -mt-4">{t('notfound.title')}</h1>
      <p className="text-zinc-400 text-sm mb-8 max-w-xs">{t('notfound.desc')}</p>
      <Link to="/" className="inline-flex items-center gap-2 bg-violet-400 text-zinc-950 font-semibold text-sm px-6 py-3 rounded-full hover:bg-violet-300 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t('notfound.btn_home')}
      </Link>
    </div>
  );
}
