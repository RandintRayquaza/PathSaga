import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { nextStep, prevStep, setAnswer, setResult } from '../redux/slices/assessmentSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { QUESTIONS } from '../utils/assessmentData';
import StepIndicator from '../components/ui/StepIndicator';
import Button from '../components/ui/Button';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Assessment() {
  const { t } = useTranslation();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { currentStep, answers } = useSelector((s) => s.assessment);

  const q        = QUESTIONS[currentStep];
  const selected = answers[q?.key];
  const isLast   = currentStep === QUESTIONS.length - 1;

  const handleNext = () => {
    if (isLast) {
      /* Mock result — replace with real AI API response */
      dispatch(setResult({ career: 'UX Designer', matched: true }));
      navigate('/dashboard');
    } else {
      dispatch(nextStep());
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl">

        {/* Logo */}
        <div className="text-center mb-10">
          <span className="font-display text-xl text-ink-50">
            Path<span className="text-lime-400">Saga</span>
          </span>
          <p className="text-sm text-ink-500 mt-1">{t('assessment.title')}</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-6">
          <StepIndicator current={currentStep} total={QUESTIONS.length} />
          <span className="text-xs text-ink-500">
            {t('assessment.step_count', { current: currentStep + 1, total: QUESTIONS.length })}
          </span>
        </div>

        {/* Question card with AnimatePresence for smooth transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="bg-ink-900 border border-ink-700 rounded-2xl p-6 md:p-8"
          >
            <h2 className="font-display text-xl md:text-2xl text-ink-50 mb-6 leading-tight">
              {t(q.question)}
            </h2>

            <fieldset>
              <legend className="sr-only">{t(q.question)}</legend>
              <div className="space-y-3">
                {q.options.map((opt) => {
                  const active = selected === opt;
                  return (
                    <label key={opt} className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name={q.key}
                        value={opt}
                        checked={active}
                        onChange={() => dispatch(setAnswer({ key: q.key, value: opt }))}
                        className="sr-only"
                      />
                      <div className={`flex-1 rounded-xl border px-4 py-3.5 text-sm transition-all duration-150 ${
                        active
                          ? 'bg-lime-400/10 border-lime-400 text-lime-300 font-medium shadow-[0_0_12px_rgba(200,241,53,0.08)]'
                          : 'bg-ink-800 border-ink-600 text-ink-300 group-hover:border-ink-400'
                      }`}>
                        {t(opt)}
                      </div>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Nav buttons */}
            <div className="flex items-center justify-between mt-8">
              <Button variant="ghost" size="sm" onClick={() => dispatch(prevStep())} disabled={currentStep === 0}>
                <ChevronLeft className="w-4 h-4" /> {t('assessment.btn_back')}
              </Button>
              <Button onClick={handleNext} disabled={!selected}>
                {isLast ? <>{t('assessment.btn_results')} <ArrowRight className="w-4 h-4" /></> : <>{t('assessment.btn_next')} <ChevronRight className="w-4 h-4" /></>}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
