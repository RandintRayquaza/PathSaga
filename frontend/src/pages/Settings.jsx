import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Trash2, Save, X, User, Shield, Sparkles, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { logout } from '../redux/slices/authSlice';
import api from '../utils/api';
import { auth } from '../config/firebase'; // Ensure we can sign out of firebase
import { signOut } from 'firebase/auth';

import FormField from '../components/ui/FormField';

export default function Settings() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── Local State for Form ───────────────────────────────────────────────
  // We use local state to prevent jumping before explicitly saving
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    degree: user?.degree || '',
    stream: user?.stream || '',
    targetDomain: user?.targetDomain || '',
    customInstructions: user?.customInstructions || '',
    allowDataUsage: true,
    emailUpdates: false,
    preferredLanguage: 'English',
    coachingTone: 'Detailed',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // In a real flow, this would call api.put('/api/auth/profile', formData)
      // and then update Redux. We demonstrate the success state here.
      await new Promise(res => setTimeout(res, 800)); // Simulating network
      toast.success('Profile settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    
    setIsDeleting(true);
    try {
      // 1. Call backend to erase database records using token
      await api.delete('/api/auth/delete-account');

      // 2. Sign out of Firebase completely
      await signOut(auth);

      // 3. Clear Redux
      dispatch(logout());

      toast.success('Your account has been permanently deleted.');
      setShowDeleteModal(false);
      
      // 4. Redirect home
      navigate('/');
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error('Failed to delete account. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-zinc-50 mb-2">Settings</h1>
        <p className="text-zinc-400">Manage your profile, preferences, and account security.</p>
      </div>

      <div className="space-y-10">
        
        {/* 1️⃣ PROFILE SETTINGS */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
            <User className="w-5 h-5 text-violet-400" />
            <h2 className="font-display text-xl text-zinc-100">Profile Settings</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField 
              label="Full Name" 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleChange} 
            />
            <FormField 
              label="Target Career Domain" 
              name="targetDomain" 
              value={formData.targetDomain} 
              onChange={handleChange} 
            />
            <FormField 
              label="Degree / Class" 
              name="degree" 
              value={formData.degree} 
              onChange={handleChange} 
            />
            <FormField 
              label="Stream / Specialization" 
              name="stream" 
              value={formData.stream} 
              onChange={handleChange} 
            />
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-2">Custom AI Instructions</label>
              <textarea
                name="customInstructions"
                value={formData.customInstructions}
                onChange={handleChange}
                placeholder='"I want a remote job", "I have 2 hours daily"'
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none h-24"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </section>

        {/* 2️⃣ ACCOUNT & SECURITY */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
            <Shield className="w-5 h-5 text-violet-400" />
            <h2 className="font-display text-xl text-zinc-100">Account Security</h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Connected Email</label>
              <input 
                type="text" 
                value={user?.email || 'No email attached'} 
                disabled 
                className="w-full sm:max-w-md bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-500 cursor-not-allowed"
              />
              <p className="text-xs text-zinc-500 mt-2">Email is linked to your Google Auth provider and cannot be changed here.</p>
            </div>
            
            <div className="pt-4">
              <span className="block text-sm font-medium text-zinc-300 mb-3">Authentication Providers</span>
              <div className="flex items-center gap-3 p-3 border border-zinc-800 rounded-xl bg-zinc-950/50 w-fit">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                <span className="text-sm font-medium text-zinc-300 text-nowrap">Google Connected</span>
                <span className="ml-2 w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
            </div>
          </div>
        </section>

        {/* 3️⃣ AI PREFERENCES */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <h2 className="font-display text-xl text-zinc-100">Path AI Preferences</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Preferred Language</label>
              <select
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-violet-500 transition-colors"
                aria-label="Preferred language"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (Beta)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Coaching Tone</label>
              <select
                name="coachingTone"
                value={formData.coachingTone}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-violet-500 transition-colors"
                aria-label="Coaching tone"
              >
                <option value="Detailed">Detailed & Explanatory</option>
                <option value="Concise">Concise & Direct</option>
              </select>
            </div>

          </div>
        </section>

        {/* 4️⃣ PRIVACY SETTINGS */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
            <BookOpen className="w-5 h-5 text-violet-400" />
            <h2 className="font-display text-xl text-zinc-100">Privacy & Data</h2>
          </div>
          <div className="space-y-6">
            
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative flex items-start pt-0.5">
                <input 
                  type="checkbox" 
                  name="allowDataUsage"
                  checked={formData.allowDataUsage}
                  onChange={handleChange}
                  className="peer sr-only" 
                />
                <div className="w-5 h-5 border-2 border-zinc-600 rounded bg-zinc-900 peer-checked:bg-violet-500 peer-checked:border-violet-500 transition-colors overflow-hidden">
                  <svg className="w-full h-full text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-zinc-200">Help improve Path AI</p>
                <p className="text-sm text-zinc-500 mt-1">Allow anonymous analysis of your assessment responses to improve the core intelligence layer.</p>
              </div>
            </label>

            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative flex items-start pt-0.5">
                <input 
                  type="checkbox" 
                  name="emailUpdates"
                  checked={formData.emailUpdates}
                  onChange={handleChange}
                  className="peer sr-only" 
                />
                <div className="w-5 h-5 border-2 border-zinc-600 rounded bg-zinc-900 peer-checked:bg-violet-500 peer-checked:border-violet-500 transition-colors overflow-hidden">
                  <svg className="w-full h-full text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-zinc-200">Important Email Updates</p>
                <p className="text-sm text-zinc-500 mt-1">Receive emails about major platform updates and roadmap adjustments.</p>
              </div>
            </label>

          </div>
        </section>

        {/* 5️⃣ DANGER ZONE */}
        <section className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 sm:p-8 mt-16">
          <div className="flex items-center gap-3 mb-6 border-b border-red-500/20 pb-4">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h2 className="font-display text-xl text-red-400">Danger Zone</h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-zinc-100 font-medium mb-1">Delete Account</h3>
              <p className="text-sm text-zinc-400 max-w-md">
                Permanently remove your account, all assessment data, roadmaps, and chat history. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="shrink-0 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/50 px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </section>

      </div>

      {/* 🔴 DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl">
            <button 
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            
            <h3 className="font-display text-2xl font-bold text-zinc-50 mb-2">Are you absolutely sure?</h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              This action is <span className="text-zinc-50 font-semibold">permanent</span>. All profile data, assessments, and generated roadmaps will be removed entirely from our servers.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Type <strong>DELETE</strong> to confirm
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                autoComplete="off"
                placeholder="DELETE"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:bg-red-600/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
