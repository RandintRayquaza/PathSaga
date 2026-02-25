import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../../redux/slices/languageSlice';
import useT from '../../i18n/useT';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi',   native: 'हिंदी',   flag: '🇮🇳' },
];

export default function LanguageSection({ value, onChange }) {
  const dispatch   = useDispatch();
  const activeLang = useSelector((s) => s.language.lang);
  const t = useT();

  const handlePick = (code) => {
    dispatch(setLanguage(code));
    onChange(code);
  };

  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">{t('language')}</h2>
        <p className="text-xs text-zinc-500 mt-1">{t('languageSubtitle')}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {LANGUAGES.map(({ code, native, flag }) => {
          const active = activeLang === code;
          return (
            <button key={code} type="button" onClick={() => handlePick(code)}
              className={`flex items-center gap-3 px-5 py-3 rounded-xl border text-sm font-medium transition-all ${
                active
                  ? 'bg-violet-400/10 border-violet-400 text-violet-300'
                  : 'bg-zinc-800 border-zinc-600 text-zinc-300 hover:border-zinc-400'
              }`}>
              <span className="text-base leading-none">{flag}</span>
              <span>{native}</span>
              {active && <span className="text-xs text-violet-500 ml-1">{t('active')}</span>}
            </button>
          );
        })}
      </div>

      {activeLang === 'hi' && (
        <p className="text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2">
          {t('hindiNote')}
        </p>
      )}
    </section>
  );
}
