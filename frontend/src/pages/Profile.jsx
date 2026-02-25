import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { loginSuccess } from '../redux/slices/authSlice';
import Navbar from '../components/layout/Navbar';

import BasicInfoSection   from './profile/BasicInfoSection';
import CareerSection      from './profile/CareerSection';
import InterestsSection   from './profile/InterestsSection';
import LanguageSection    from './profile/LanguageSection';
import PreferencesSection from './profile/PreferencesSection';
import useT               from '../i18n/useT';
import toast              from 'react-hot-toast';

// ── Initial form state ────────────────────────────────────────────────────────
const INITIAL_FORM = (user) => ({
  name:               user?.name || user?.displayName || '',
  educationType:      'school',
  classLevel:         '',
  degree:             '',
  yearSemester:       '',
  specialization:     '',
  subSpecialization:  '',
  stream:             '',
  targetDomain:       '',
  customDomain:       '',
  skillLevel:         '',
  interests:          [],
  customInstructions: '',
  studyHoursPerDay:   '',
  languagePreference: 'en',
});

// ── Validation ────────────────────────────────────────────────────────────────
function validate(form) {
  const isSchool  = form.educationType === 'school';
  const isCollege = form.educationType === 'college';
  const isExploring   = form.stream === 'Still Exploring';
  const showStreamPicker  = isSchool && (form.classLevel === '11' || form.classLevel === '12');
  const subSpecRequired   = isCollege && !!form.specialization && form.specialization !== 'Other';

  if (!form.name.trim())       return 'Full name is required.';
  if (!form.educationType)     return 'Education type is required.';
  if (isSchool  && !form.classLevel)            return 'Class is required.';
  if (isCollege && !form.degree.trim())         return 'Degree is required.';
  if (isCollege && !form.yearSemester)          return 'Year / Semester is required.';
  if (isCollege && !form.specialization.trim()) return 'Specialization / Branch is required.';
  if (subSpecRequired && !form.subSpecialization.trim()) return 'Please select your focus area.';
  if (showStreamPicker && !form.stream)         return 'Stream is required.';
  if (!isExploring && !form.targetDomain)       return 'Target career domain is required.';
  if (form.targetDomain === 'Other' && !form.customDomain.trim()) return 'Please describe your career interest.';
  if (!form.skillLevel)                         return 'Skill level is required.';
  return null;
}

// ── Page component ────────────────────────────────────────────────────────────
export default function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = useT();
  const { user } = useSelector((s) => s.auth);

  const [form,     setForm]     = useState(() => INITIAL_FORM(user));
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);

  // Prefill saved profile — use Redux first, fetch only if data seems incomplete
  useEffect(() => {
    // Helper to populate form from profile data
    const populateForm = (d) => {
      setForm((prev) => ({
        ...prev,
        name:               d.name               || prev.name,
        educationType:      d.educationType      || 'school',
        classLevel:         d.classLevel         || '',
        degree:             d.degree             || '',
        yearSemester:       d.yearSemester       || '',
        specialization:     d.specialization     || '',
        subSpecialization:  d.subSpecialization  || '',
        stream:             d.stream             || '',
        targetDomain:       d.targetDomain       || '',
        customDomain:       d.customDomain       || '',
        skillLevel:         d.skillLevel         || '',
        interests:          d.interests          || [],
        customInstructions: d.customInstructions || '',
        studyHoursPerDay:   d.studyHoursPerDay   || '',
        languagePreference: d.languagePreference || 'en',
      }));
    };

    // If Redux already has full profile data, skip the API call
    if (user?.educationType) {
      populateForm(user);
      setFetching(false);
      return;
    }

    // Otherwise fetch from backend
    async function prefill() {
      try {
        const res = await api.get('/api/auth/me');
        if (res.data?.success) {
          populateForm(res.data.data);
        }
      } catch (e) {
        console.error('Prefill error', e);
      } finally {
        setFetching(false);
      }
    }
    prefill();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toggle interest chips
  const toggleInterest = (item) =>
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(item)
        ? f.interests.filter((i) => i !== item)
        : [...f.interests, item],
    }));

  // Submit
  const handleSave = async (e) => {
    e.preventDefault();
    const err = validate(form);
    if (err) { toast.error(err); return; }

    setLoading(true);
    try {
      const isSchool  = form.educationType === 'school';
      const isCollege = form.educationType === 'college';
      const payload = {
        ...form,
        studyHoursPerDay: form.studyHoursPerDay ? Number(form.studyHoursPerDay) : null,
        ...(isSchool  && { degree: '', yearSemester: '', specialization: '', subSpecialization: '' }),
        ...(isCollege && { classLevel: '' }),
      };
      const res = await api.put('/api/auth/update-profile', payload);
      if (res.data?.success) {
        dispatch(loginSuccess({ ...res.data.data, token: user?.token }));
        navigate('/profile');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-violet-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950 pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">

          <header className="mb-8">
            <h1 className="font-display text-3xl text-zinc-50 mb-2">{user?.profileComplete ? t('editProfile', 'Edit Profile') : t('completeProfile')}</h1>
            <p className="text-zinc-400 text-sm">{t('profileSubtitle')}</p>
          </header>

          <form onSubmit={handleSave} className="space-y-8">
            <BasicInfoSection   form={form} setForm={setForm} />
            <CareerSection      form={form} setForm={setForm} />
            <InterestsSection   interests={form.interests} onToggle={toggleInterest} />
            <LanguageSection
              value={form.languagePreference}
              onChange={(code) => setForm((f) => ({ ...f, languagePreference: code }))}
            />
            <PreferencesSection form={form} setForm={setForm} />

            <button type="submit" disabled={loading}
              className="w-full bg-violet-400 hover:bg-violet-300 text-zinc-950 font-bold py-4 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base">
              {loading ? t('saving') : t('saveProfile')}
            </button>
          </form>

        </div>
      </main>
    </>
  );
}
