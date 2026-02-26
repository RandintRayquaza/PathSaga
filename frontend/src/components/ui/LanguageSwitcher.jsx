import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../utils/api';
import { loginSuccess } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const currentLang = i18n.resolvedLanguage || 'en';

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' }
  ];

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = async (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
    
    // If user is authenticated, sync language persistently with the DB
    if (user && user.uid) {
      try {
        const res = await api.put('/api/auth/update-profile', { languagePreference: lng });
        if (res.data?.success) {
          dispatch(loginSuccess(res.data.data)); // Update global state
          toast.success(lng === 'hi' ? 'भाषा सफलतापूर्वक बदली गई' : 'Language changed successfully', {
            icon: '🌐',
            style: {
              background: '#18181b',
              color: '#f4f4f5',
              border: '1px solid #27272a'
            }
          });
        }
      } catch (err) {
        console.error('Failed to sync language preference:', err);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors py-2 px-3 rounded-full hover:bg-zinc-800/50 outline-none"
        aria-label="Change Language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline-block uppercase tracking-wider text-[11px] font-bold">
          {currentLang}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-40 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50 origin-top-right"
          >
            <div className="py-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                    currentLang === lang.code 
                      ? 'text-violet-400 font-medium bg-violet-500/10' 
                      : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800'
                  }`}
                >
                  {lang.label}
                  {currentLang === lang.code && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
