import { inputCls, labelCls } from './profileData';
import useT from '../../i18n/useT';

export default function PreferencesSection({ form, setForm }) {
  const t   = useT();
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
      <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">{t('preferences')}</h2>

      <div>
        <label className={labelCls}>
          {t('customInstructions')} <span className="text-zinc-600">{t('optional')}</span>
        </label>
        <textarea
          className={`${inputCls} resize-none`} rows={3}
          value={form.customInstructions}
          onChange={(e) => set('customInstructions', e.target.value)}
          placeholder={t('customInstructionsPlaceholder')}
        />
      </div>

      <div>
        <label className={labelCls}>
          {t('studyHours')} <span className="text-zinc-600">{t('optional')}</span>
        </label>
        <input type="number" min="0.5" max="16" step="0.5" className={inputCls}
          value={form.studyHoursPerDay}
          onChange={(e) => set('studyHoursPerDay', e.target.value)}
          placeholder={t('studyHoursPlaceholder')} />
      </div>
    </section>
  );
}
