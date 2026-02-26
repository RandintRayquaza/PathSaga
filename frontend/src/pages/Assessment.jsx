import { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  setQuestions, setAnswer, nextStep, prevStep,
  setStatus, setError, setMissingFields, setResults,
} from '../redux/slices/assessmentSlice';
import { setResults as setUserResults } from '../redux/slices/userSlice';
import api from '../utils/api';
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, Send, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Assessment() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useSelector((s) => s.auth);
  const { questions, currentStep, answers, status, errorMessage, missingFields } = useSelector((s) => s.assessment);
  const [isFiring, setIsFiring] = useState(false);
  const debounceRef = useRef(null);

  const fetchQuestions = useCallback(async () => {
    if (isFiring || status === 'generating') return;
    if (debounceRef.current) return;
    debounceRef.current = setTimeout(() => { debounceRef.current = null; }, 2000);

    setIsFiring(true);
    dispatch(setStatus('generating'));
    try {
      const res = await api.post('/api/assessment/generate-questions');
      if (res.data?.success) {
        const qs = res.data.data?.questions || [];
        if (qs.length === 0) throw new Error('No questions returned from AI');
        dispatch(setQuestions(qs));
        dispatch(setStatus('idle'));
      }
    } catch (err) {
      const missing = err.response?.data?.missingFields || [];
      const msg = err.response?.data?.message || 'Failed to generate questions. Please try again.';

      if (missing.length > 0) {
        dispatch(setMissingFields(missing));
      }
      
      toast.error(msg);
      dispatch(setError(msg));
    } finally {
      setIsFiring(false);
    }
  }, [dispatch, isFiring, status]);

  // useEffect removed to prevent auto-triggering
  // The user will click "Start Assessment" manually

  const handleSubmit = async () => {
    if (isFiring || status === 'submitting') return;
    if (debounceRef.current) return;
    debounceRef.current = setTimeout(() => { debounceRef.current = null; }, 2000);
    
    setIsFiring(true);
    dispatch(setStatus('submitting'));
    try {
      const res = await api.post('/api/assessment/submit-answers', { questions, answers });
      if (res.data?.success) {
        dispatch(setResults({
          analysis: res.data.data.analysis,
          id: res.data.data.id,
        }));
        dispatch(setUserResults(res.data.data));
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Submission failed. Please try again.';
      toast.error(msg);
      dispatch(setStatus('idle'));
    } finally {
      setIsFiring(false);
    }
  };

  const q      = questions[currentStep];
  const answer = q ? (answers[q.id] || '') : '';
  const isLast = currentStep === questions.length - 1;
  const hasAnswer = answer.trim().length > 0;

  // ── Loading state
  if (status === 'generating') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 px-4">
        <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
        <h2 className="font-display text-xl text-zinc-50 text-center">Path AI is crafting your assessment…</h2>
        <p className="text-zinc-500 text-sm text-center max-w-sm">
          Personalised questions based on your profile for <span className="text-violet-400">{user?.targetDomain || 'your domain'}</span>
        </p>
      </div>
    );
  }

  // ── Submitting state
  if (status === 'submitting') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 px-4">
        <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
        <h2 className="font-display text-xl text-zinc-50 text-center">Analysing your answers…</h2>
        <p className="text-zinc-500 text-sm text-center max-w-sm">Path AI is evaluating your responses and generating your personalised roadmap.</p>
      </div>
    );
  }

  // ── Profile-incomplete error (field-specific)
  if (status === 'error' && missingFields?.length > 0) {
    const FIELD_DISPLAY = {
      name: 'Full Name', educationType: 'Education Type', classLevel: 'Class',
      degree: 'Degree', yearSemester: 'Year / Semester', specialization: 'Specialization',
      stream: 'Stream', targetDomain: 'Career Domain', customDomain: 'Custom Domain',
      skillLevel: 'Skill Level',
    };
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 px-4">
        <ClipboardList className="w-10 h-10 text-amber-400" />
        <h2 className="font-display text-xl text-zinc-50">Complete Your Profile First</h2>
        <p className="text-zinc-400 text-sm text-center max-w-sm">The following fields need to be filled in before you can take the assessment:</p>
        <ul className="mt-2 space-y-1">
          {missingFields.map((f) => (
            <li key={f} className="text-sm text-amber-300 flex items-center gap-2">
              <span className="text-amber-500">•</span> {FIELD_DISPLAY[f] || f}
            </li>
          ))}
        </ul>
        <Link to="/profile/edit"
          className="mt-4 bg-violet-400 text-zinc-950 font-semibold px-6 py-3 rounded-xl hover:bg-violet-300 transition-colors">
          Complete Profile
        </Link>
      </div>
    );
  }

  // ── Generic error state (server errors)
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 px-4">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <h2 className="font-display text-xl text-zinc-50">Something went wrong</h2>
        <p className="text-zinc-400 text-sm text-center max-w-sm">{errorMessage}</p>
        <button onClick={fetchQuestions}
          className="mt-4 bg-violet-400 text-zinc-950 font-semibold px-6 py-3 rounded-xl hover:bg-violet-300 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 px-4">
        <ClipboardList className="w-10 h-10 text-violet-400" />
        <h2 className="font-display text-xl text-zinc-50 font-medium">Ready to take the assessment?</h2>
        <p className="text-zinc-400 text-sm text-center max-w-sm mb-4">
          Click the button below to generate personalized questions for your target domain.
        </p>
        <button onClick={fetchQuestions}
          disabled={isFiring}
          className="bg-violet-400 text-zinc-950 font-semibold px-6 py-3 rounded-xl hover:bg-violet-300 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
          Start Assessment
        </button>
      </div>
    );
  }

  const difficultyColor = { easy: 'text-violet-400', medium: 'text-amber-400', hard: 'text-red-400' };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="font-display text-xl text-zinc-50">Path<span className="text-violet-400">Saga</span></span>
          <p className="text-sm text-zinc-500 mt-1">Step 2 — Skills Assessment</p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-500">Question {currentStep + 1} of {questions.length}</span>
            <span className={`text-xs font-medium ${difficultyColor[q.difficulty] || 'text-zinc-500'}`}>
              {q.difficulty} · {q.type}
            </span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-400 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 md:p-8"
          >
            <h2 className="font-display text-lg md:text-xl text-zinc-50 mb-6 leading-snug">
              {q.question}
            </h2>

            {/* MCQ */}
            {q.type === 'mcq' && Array.isArray(q.options) && (
              <div className="space-y-3">
                {q.options.map((opt, i) => {
                  const active = answer === opt;
                  return (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <input type="radio" name={`q-${q.id}`} value={opt} checked={active}
                        onChange={() => dispatch(setAnswer({ id: q.id, value: opt }))}
                        className="sr-only" />
                      <div className={`flex-1 rounded-xl border px-4 py-3 text-sm transition-all duration-150 ${
                        active
                          ? 'bg-violet-400/10 border-violet-400 text-violet-300 font-medium'
                          : 'bg-zinc-800 border-zinc-600 text-zinc-300 group-hover:border-zinc-400'
                      }`}>
                        <span className="text-zinc-600 mr-2">{String.fromCharCode(65 + i)}.</span>
                        {opt}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Short-Answer / Scenario */}
            {(q.type === 'short-answer' || q.type === 'scenario') && (
              <textarea
                className="w-full bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-400/60 focus:ring-1 focus:ring-violet-400/20 resize-none transition-all"
                rows={q.type === 'scenario' ? 6 : 4}
                placeholder={q.type === 'scenario' ? 'Describe your approach in detail…' : 'Type your answer here…'}
                value={answer}
                onChange={(e) => dispatch(setAnswer({ id: q.id, value: e.target.value }))}
              />
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={() => dispatch(prevStep())}
                disabled={currentStep === 0}
                className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-2"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              {isLast ? (
                <button
                  onClick={handleSubmit}
                  disabled={!hasAnswer || isFiring}
                  className="flex items-center gap-2 bg-violet-400 text-zinc-950 font-semibold px-6 py-2.5 rounded-xl hover:bg-violet-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  <Send className="w-4 h-4" /> Submit Assessment
                </button>
              ) : (
                <button
                  onClick={() => dispatch(nextStep())}
                  disabled={!hasAnswer}
                  className="flex items-center gap-1.5 bg-violet-400 text-zinc-950 font-semibold px-5 py-2.5 rounded-xl hover:bg-violet-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
