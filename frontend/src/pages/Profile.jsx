import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { loginSuccess } from '../redux/slices/authSlice';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';

export default function Profile() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    name: '',
    educationLevel: 'school',
    classSemester: '',
    stream: '',
    interests: '',
    languagePreference: 'en',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          const data = response.data.data;
          setForm({
            name: data.name || '',
            educationLevel: data.educationLevel || 'school',
            classSemester: data.classSemester || '',
            stream: data.stream || '',
            interests: data.interests?.join(', ') || '',
            languagePreference: data.languagePreference || 'en',
          });
          // Resync store
          dispatch(loginSuccess({ ...data, token: user?.token }));
        }
      } catch (err) {
        console.error('Fetch profile error:', err);
        setError('Failed to load profile.');
      } finally {
        setFetching(false);
      }
    }
    loadProfile();
  }, [dispatch, user?.token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const payload = {
        ...form,
        interests: form.interests.split(',').map(i => i.trim()).filter(Boolean),
      };
      const response = await api.put('/auth/update-profile', payload);
      if (response.data.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        dispatch(loginSuccess({ ...response.data.data, token: user?.token }));
      }
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    
    try {
      await api.delete('/auth/delete-account');
      window.location.href = '/';
    } catch (err) {
      console.error('Delete account error:', err);
      setError('Failed to delete account.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ink-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          
          <header className="mb-8">
            <h1 className="font-display text-3xl text-ink-50 mb-2">Your Profile</h1>
            <p className="text-ink-400 text-sm">Manage your personal information and preferences.</p>
          </header>

          <div className="bg-ink-900 border border-ink-800 rounded-2xl p-6 md:p-8 shadow-xl">
            {fetching ? (
              <div className="flex justify-center items-center py-10">
                <span className="w-6 h-6 border-2 border-lime-400 border-t-transparent rounded-full animate-spin"></span>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-6">
                
                <FormField
                  id="name"
                  label="Full Name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  disabled={!isEditing}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="educationLevel" className="block text-sm font-medium text-ink-300">
                      Education Level
                    </label>
                    <select
                      id="educationLevel"
                      value={form.educationLevel}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full bg-ink-950 border border-ink-800 rounded-xl px-4 py-3 text-sm text-ink-100 placeholder-ink-600 focus:outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="school">School</option>
                      <option value="college">College</option>
                      <option value="professional">Professional</option>
                    </select>
                  </div>

                  <FormField
                    id="classSemester"
                    label="Class / Semester"
                    type="text"
                    value={form.classSemester}
                    onChange={handleChange}
                    placeholder="e.g. 10th Grade / 3rd Sem"
                    disabled={!isEditing}
                  />
                </div>

                <FormField
                  id="stream"
                  label="Stream / Major"
                  type="text"
                  value={form.stream}
                  onChange={handleChange}
                  placeholder="e.g. Science, Commerce, Computer Science"
                  disabled={!isEditing}
                />

                <FormField
                  id="interests"
                  label="Interests (comma separated)"
                  type="text"
                  value={form.interests}
                  onChange={handleChange}
                  placeholder="e.g. Coding, Design, Data Analysis"
                  disabled={!isEditing}
                />

                <div className="space-y-2">
                  <label htmlFor="languagePreference" className="block text-sm font-medium text-ink-300">
                    Preferred Language
                  </label>
                  <select
                    id="languagePreference"
                    value={form.languagePreference}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-ink-950 border border-ink-800 rounded-xl px-4 py-3 text-sm text-ink-100 placeholder-ink-600 focus:outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}
                {success && <p className="text-sm text-lime-400">{success}</p>}

                <div className="pt-4 flex flex-col md:flex-row gap-4 items-center justify-between border-t border-ink-800">
                  {isEditing ? (
                    <div className="w-full md:w-auto flex gap-3">
                      <Button type="button" variant="secondary" onClick={() => setIsEditing(false)} disabled={loading} className="px-6">
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading} className="px-8">
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  ) : (
                    <Button type="button" onClick={(e) => { e.preventDefault(); setIsEditing(true); }} className="w-full md:w-auto px-8">
                      Edit Profile
                    </Button>
                  )}
                  
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="text-sm text-red-400 hover:text-red-300 font-medium px-4 py-2 transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </main>
    </>
  );
}
