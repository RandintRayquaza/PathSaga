import { DOMAINS, inputCls, labelCls, chipCls } from './profileData';
import useT from '../../i18n/useT';

const SKILL_LEVELS = [
  { key: 'beginner',     descKey: 'beginnerDesc' },
  { key: 'intermediate', descKey: 'intermediateDesc' },
  { key: 'advanced',     descKey: 'advancedDesc' },
];

export default function CareerSection({ form, setForm }) {
  const t   = useT();
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const isExploring = form.stream === 'Still Exploring';

  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
      <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">{t('careerGoals')}</h2>

      {isExploring && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3">
          <p className="text-xs text-zinc-400">
            <span className="text-violet-300 font-semibold">{t('stillExploring')}</span> {t('stillExploringHint')}
          </p>
        </div>
      )}

      <div>
        <label className={labelCls}>
          {t('targetDomain')} {isExploring ? <span className="text-zinc-600">{t('optional')}</span> : '*'}
        </label>
        <select className={inputCls} value={form.targetDomain}
          onChange={(e) => { set('targetDomain', e.target.value); set('customDomain', ''); }}>
          <option value="">{t('selectDomain')}</option>
          {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {form.targetDomain === 'Other' && (
        <div>
          <label className={labelCls}>{t('describeCareer')} *</label>
          <input className={inputCls} value={form.customDomain}
            onChange={(e) => set('customDomain', e.target.value)}
            placeholder={t('describeCareerPlaceholder')} />
          <p className="text-xs text-zinc-600 mt-1.5">{t('geminiWillUse')}</p>
        </div>
      )}

      <div>
        <label className={labelCls}>{t('skillLevel')} *</label>
        <div className="grid grid-cols-3 gap-3">
          {SKILL_LEVELS.map(({ key, descKey }) => {
            const val = key.charAt(0).toUpperCase() + key.slice(1);
            const active = form.skillLevel === val;
            return (
              <button key={val} type="button" onClick={() => set('skillLevel', val)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  active ? 'bg-violet-400/10 border-violet-400' : 'bg-zinc-800 border-zinc-600 hover:border-zinc-400'
                }`}>
                <span className={`block text-sm font-semibold ${active ? 'text-violet-300' : 'text-zinc-100'}`}>{t(key)}</span>
                <span className="block text-xs text-zinc-500 mt-0.5">{t(descKey)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
