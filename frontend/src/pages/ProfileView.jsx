import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { loginSuccess } from '../redux/slices/authSlice';
import Navbar from '../components/layout/Navbar';
import { Pencil, User, GraduationCap, Target, Languages, Settings, Loader2 } from 'lucide-react';

// ── Field-name to human-readable label map ──────────────────────────────────
const FIELD_LABELS = {
  educationType: 'Education Type',
  classLevel: 'Class',
  degree: 'Degree',
  yearSemester: 'Year / Semester',
  specialization: 'Specialization',
  subSpecialization: 'Focus Area',
  stream: 'Stream',
  targetDomain: 'Career Domain',
  customDomain: 'Custom Domain',
  skillLevel: 'Skill Level',
  interests: 'Interests',
  customInstructions: 'Custom Instructions',
  studyHoursPerDay: 'Study Hours / Day',
  languagePreference: 'Language',
};

function InfoRow({ label, value }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 py-3 border-b border-zinc-800/60 last:border-b-0">
      <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold sm:w-40 shrzinc-0">{label}</span>
      <span className="text-sm text-zinc-200">
        {Array.isArray(value) ? value.join(', ') : value}
      </span>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <section className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 md:p-6 space-y-1">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-violet-400" />
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function ProfileView() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Redux already has full profile data, use it directly (App.jsx fetches on auth)
    if (user?.educationType) {
      setProfile(user);
      setLoading(false);
      return;
    }
    // Only fetch if Redux data looks incomplete
    async function fetchProfile() {
      try {
        const res = await api.get('/api/auth/me');
        if (res.data?.success) {
          setProfile(res.data.data);
          dispatch(loginSuccess({ ...res.data.data, token: user?.token }));
        }
      } catch (e) {
        console.error('Failed to fetch profile', e);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
        </div>
      </>
    );
  }

  const p = profile || user || {};
  const langLabel = p.languagePreference === 'hi' ? 'Hindi' : 'English';

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950 pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Header */}
          <header className="flex items-center justify-between mb-2">
            <div>
              <h1 className="font-display text-3xl text-zinc-50">My Profile</h1>
              <p className="text-zinc-400 text-sm mt-1">
                {p.profileComplete
                  ? 'Your profile is complete ✓'
                  : 'Some fields are still missing — complete your profile for best results.'}
              </p>
            </div>
            <Link
              to="/profile/edit"
              className="flex items-center gap-2 bg-violet-400 hover:bg-violet-300 text-zinc-950 font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm min-h-[44px]"
            >
              <Pencil className="w-4 h-4" /> Edit Profile
            </Link>
          </header>

          {/* Basic Info */}
          <Section icon={User} title="Basic Information">
            <InfoRow label="Full Name" value={p.name} />
            <InfoRow label="Email" value={p.email} />
            <InfoRow label={FIELD_LABELS.educationType} value={p.educationType === 'school' ? 'School' : p.educationType === 'college' ? 'College' : null} />
          </Section>

          {/* Education */}
          <Section icon={GraduationCap} title="Education">
            {p.educationType === 'school' && (
              <>
                <InfoRow label={FIELD_LABELS.classLevel} value={p.classLevel ? `Class ${p.classLevel}` : null} />
                <InfoRow label={FIELD_LABELS.stream} value={p.stream} />
              </>
            )}
            {p.educationType === 'college' && (
              <>
                <InfoRow label={FIELD_LABELS.degree} value={p.degree} />
                <InfoRow label={FIELD_LABELS.yearSemester} value={p.yearSemester} />
                <InfoRow label={FIELD_LABELS.specialization} value={p.specialization} />
                <InfoRow label={FIELD_LABELS.subSpecialization} value={p.subSpecialization} />
              </>
            )}
          </Section>

          {/* Career */}
          <Section icon={Target} title="Career Goals">
            <InfoRow label={FIELD_LABELS.targetDomain} value={p.targetDomain === 'Other' ? p.customDomain : p.targetDomain} />
            <InfoRow label={FIELD_LABELS.skillLevel} value={p.skillLevel} />
            <InfoRow label={FIELD_LABELS.interests} value={p.interests} />
          </Section>

          {/* Preferences */}
          <Section icon={Settings} title="Preferences">
            <InfoRow label={FIELD_LABELS.studyHoursPerDay} value={p.studyHoursPerDay ? `${p.studyHoursPerDay} hrs` : null} />
            <InfoRow label={FIELD_LABELS.languagePreference} value={langLabel} />
            <InfoRow label={FIELD_LABELS.customInstructions} value={p.customInstructions} />
          </Section>

          {/* Language */}
          <Section icon={Languages} title="Language">
            <InfoRow label="Preferred Language" value={langLabel} />
          </Section>

        </div>
      </main>
    </>
  );
}
