import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { nextStep, prevStep } from '../redux/slices/onboardingSlice';
import StepIndicator  from '../components/ui/StepIndicator';
import Button         from '../components/ui/Button';
import OnboardingStep1 from '../components/ui/OnboardingStep1';
import OnboardingStep2 from '../components/ui/OnboardingStep2';
import OnboardingStep3 from '../components/ui/OnboardingStep3';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const STEP_META = [
  { title: 'onboarding.s1_title',  subtitle: 'onboarding.s1_sub'  },
  { title: 'onboarding.s2_title',  subtitle: 'onboarding.s2_sub'  },
  { title: 'onboarding.s3_title',  subtitle: 'onboarding.s3_sub'  },
];

/* Validate each step before allowing Next */
function canProceed(step, state) {
  if (step === 0) return !!state.educationType;
  if (step === 1) return state.interests.length > 0;
  if (step === 2) return !!state.nextAction;
  return false;
}

export default function Onboarding() {
  const { t } = useTranslation();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const state     = useSelector((s) => s.onboarding);
  const { step }  = state;

  const meta      = STEP_META[step];
  const isLast    = step === STEP_META.length - 1;
  const valid     = canProceed(step, state);

  const handleNext = () => {
    if (isLast) {
      navigate(state.nextAction === 'assessment' ? '/assessment' : '/dashboard');
    } else {
      dispatch(nextStep());
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-10">
          <span className="font-display text-xl text-ink-50">
            Path<span className="text-lime-400">Saga</span>
          </span>
        </div>

        {/* Card */}
        <div className="bg-ink-900 border border-ink-700 rounded-2xl p-6 md:p-8">

          {/* Step indicator + counter */}
          <div className="flex items-center justify-between mb-6">
            <StepIndicator current={step} total={STEP_META.length} />
            <span className="text-xs text-ink-500">
              {t('onboarding.step_counter', { current: step + 1, total: STEP_META.length })}
            </span>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="font-display text-2xl text-ink-50 mb-1">{t(meta.title)}</h1>
            <p className="text-sm text-ink-400">{t(meta.subtitle)}</p>
          </div>

          {/* Step content */}
          {step === 0 && <OnboardingStep1 />}
          {step === 1 && <OnboardingStep2 />}
          {step === 2 && <OnboardingStep3 />}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8">
            <Button variant="ghost" size="sm" onClick={() => dispatch(prevStep())} disabled={step === 0}>
              <ChevronLeft className="w-4 h-4" /> {t('onboarding.btn_back')}
            </Button>

            <Button onClick={handleNext} disabled={!valid}>
              {isLast ? <>{t('onboarding.btn_go')} <ArrowRight className="w-4 h-4" /></> : <>{t('onboarding.btn_next')} <ChevronRight className="w-4 h-4" /></>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
