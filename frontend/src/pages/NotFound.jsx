import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-zinc-950 flex items-center justify-center px-6 overflow-hidden">

      {/* Background subtle glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/10 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 text-center max-w-md w-full">

        {/* 404 */}
        <p className="font-display text-[100px] sm:text-[140px] font-bold leading-none tracking-tight text-zinc-800 select-none">
          404
        </p>

        {/* Heading */}
        <h1 className="font-display text-2xl sm:text-3xl text-zinc-100 mt-2">
          {t('notfound.title')}
        </h1>

        {/* Description */}
        <p className="text-zinc-400 text-sm sm:text-base mt-3 mb-10 leading-relaxed">
          {t('notfound.desc')}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-violet-500 text-white font-medium text-sm px-6 py-3 rounded-full hover:bg-violet-400 transition-all duration-200 active:scale-95"
          >
            <Home className="w-4 h-4" />
            {t('notfound.btn_home')}
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-200 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            { "Go back"}
          </button>

        </div>

      </div>
    </div>
  );
}