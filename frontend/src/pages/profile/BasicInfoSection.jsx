import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Sparkles } from 'lucide-react';
import {
  CLASS_LEVELS, YEAR_SEMS, SENIOR_SCHOOL_STREAMS,
  COLLEGE_SPECS, BRANCH_SUBSPECS, detectDegreeKey,
  inputCls, labelCls, chipCls, toggleCls,
} from './profileData';
import useT from '../../i18n/useT';

export default function BasicInfoSection({ form, setForm }) {
  const t   = useT();
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const isSchool  = form.educationType === 'school';
  const isCollege = form.educationType === 'college';
  const isExploring = form.stream === 'Still Exploring';

  const showStreamPicker    = isSchool && (form.classLevel === '11' || form.classLevel === '12');
  const isAutoGeneralStream = isSchool && (form.classLevel === '9'  || form.classLevel === '10');

  const degreeKey      = useMemo(() => detectDegreeKey(form.degree), [form.degree]);
  const specOptions    = degreeKey ? COLLEGE_SPECS[degreeKey] : null;
  const showFreeSpec   = isCollege && form.degree.trim().length > 1 && specOptions === null;
  const showSpecPicker = isCollege && form.degree.trim().length > 1 && specOptions !== null;

  const subSpecOptions    = form.specialization ? BRANCH_SUBSPECS[form.specialization] : null;
  const showSubSpecPicker = isCollege && !!subSpecOptions;
  const showFreeSubSpec   = isCollege && form.specialization === 'Other';

  const handleClassLevel = (cls) => {
    if (cls === '9' || cls === '10') setForm((f) => ({ ...f, classLevel: cls, stream: 'General' }));
    else                             setForm((f) => ({ ...f, classLevel: cls, stream: '' }));
  };

  const handleEduType = (type) =>
    setForm((f) => ({
      ...f, educationType: type,
      classLevel: '', degree: '', yearSemester: '',
      specialization: '', subSpecialization: '', stream: '',
    }));

  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
      <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">{t('basicInfo')}</h2>

      {/* Name */}
      <div>
        <label className={labelCls}>{t('fullName')} *</label>
        <input className={inputCls} value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder={t('fullNamePlaceholder')} />
      </div>

      {/* Education type */}
      <div>
        <label className={labelCls}>{t('iAmCurrentlyIn')} *</label>
        <div className="flex gap-3">
          {['school', 'college'].map((type) => (
            <button key={type} type="button" onClick={() => handleEduType(type)}
              className={toggleCls(form.educationType === type)}>
              {t(type)}
            </button>
          ))}
        </div>
      </div>

      {/* ── School ── */}
      {isSchool && (
        <>
          <div>
            <label className={labelCls}>{t('class')} *</label>
            <div className="flex gap-2 flex-wrap">
              {CLASS_LEVELS.map((c) => (
                <button key={c} type="button" onClick={() => handleClassLevel(c)}
                  className={chipCls(form.classLevel === c)}>
                  {t('class')} {c}
                </button>
              ))}
            </div>
            {isAutoGeneralStream && (
              <p className="text-xs text-zinc-500 mt-2">
                {t('streamAutoGeneral')} <span className="text-zinc-300">{t('general')}</span>.
              </p>
            )}
          </div>

          {showStreamPicker && (
            <div>
              <label className={labelCls}>{t('stream')} *</label>
              <div className="flex flex-wrap gap-2">
                {SENIOR_SCHOOL_STREAMS.map((s) => (
                  <button key={s} type="button" onClick={() => set('stream', s)}
                    className={chipCls(form.stream === s)}>{s}</button>
                ))}
              </div>

              {isExploring && (
                <div className="mt-4 bg-violet-400/5 border border-violet-400/20 rounded-xl p-4 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-violet-400 shrzinc-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-violet-300 mb-1">{t('notSureStream')}</p>
                    <p className="text-xs text-zinc-400 mb-3">{t('aiCoachDesc')}</p>
                    <Link to="/aichat"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-violet-300 bg-violet-400/10 border border-violet-400/20 px-4 py-2 rounded-full hover:bg-violet-400/15 transition-all">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {t('startAiExploration')}
                    </Link>
                    <p className="text-xs text-zinc-600 mt-3">{t('stillCanSubmit')}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ── College ── */}
      {isCollege && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>{t('degree')} *</label>
              <input className={inputCls} value={form.degree}
                onChange={(e) => setForm((f) => ({ ...f, degree: e.target.value, specialization: '', subSpecialization: '' }))}
                placeholder={t('degreePlaceholder')} />
            </div>
            <div>
              <label className={labelCls}>{t('yearSemester')} *</label>
              <select className={inputCls} value={form.yearSemester} onChange={(e) => set('yearSemester', e.target.value)}>
                <option value="">{t('selectYear')}</option>
                {YEAR_SEMS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {showSpecPicker && (
            <div>
              <label className={labelCls}>{t('specializationBranch')} *</label>
              <div className="flex flex-wrap gap-2">
                {specOptions.map((s) => (
                  <button key={s} type="button"
                    onClick={() => setForm((f) => ({ ...f, specialization: s, subSpecialization: '' }))}
                    className={chipCls(form.specialization === s)}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {showFreeSpec && (
            <div>
              <label className={labelCls}>{t('specializationBranch')} *</label>
              <input className={inputCls} value={form.specialization}
                onChange={(e) => set('specialization', e.target.value)}
                placeholder={t('specPlaceholder')} />
            </div>
          )}

          {showSubSpecPicker && (
            <div>
              <label className={labelCls}>
                {t('focusArea')} *
                <span className="ml-2 text-xs text-zinc-600 normal-case font-normal">
                  {t('focusAreaHint')} {form.specialization}
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {subSpecOptions.map((s) => (
                  <button key={s} type="button" onClick={() => set('subSpecialization', s)}
                    className={chipCls(form.subSpecialization === s)}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {showFreeSubSpec && (
            <div>
              <label className={labelCls}>{t('describeSpec')} *</label>
              <input className={inputCls} value={form.subSpecialization}
                onChange={(e) => set('subSpecialization', e.target.value)}
                placeholder={t('describeSpecPlaceholder')} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
