import { INTERESTS } from './profileData';
import useT from '../../i18n/useT';

export default function InterestsSection({ interests, onToggle }) {
  const t = useT();

  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
      <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">{t('yourInterests')}</h2>
      <div className="flex flex-wrap gap-2">
        {INTERESTS.map((item) => (
          <button key={item} type="button" onClick={() => onToggle(item)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              interests.includes(item)
                ? 'bg-violet-400/10 border-violet-400 text-violet-300'
                : 'bg-zinc-800 border-zinc-600 text-zinc-400 hover:border-zinc-400'
            }`}>
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}
