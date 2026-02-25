import { useDispatch, useSelector } from 'react-redux';
import { setNextAction } from '../../redux/slices/onboardingSlice';
import { ClipboardCheck, Map } from 'lucide-react';

const OPTIONS = [
  {
    key:   'assessment',
    icon:  ClipboardCheck,
    title: 'Take Career Test',
    desc:  'Answer a focused set of questions so our AI can build your personalised career match and roadmap.',
  },
  {
    key:   'dashboard',
    icon:  Map,
    title: 'Explore Roadmap',
    desc:  'Jump straight into the dashboard and explore career paths and roadmaps available to you.',
  },
];

export default function OnboardingStep3() {
  const dispatch    = useDispatch();
  const nextAction  = useSelector((s) => s.onboarding.nextAction);

  return (
    <div>
      <p className="text-sm font-medium text-zinc-300 mb-4">How would you like to continue?</p>
      <div className="grid gap-4">
        {OPTIONS.map(({ key, icon: Icon, title, desc }) => {
          const active = nextAction === key;
          return (
            <button
              key={key}
              onClick={() => dispatch(setNextAction(key))}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                active
                  ? 'bg-violet-400/10 border-violet-400 shadow-[0_0_16px_rgba(200,241,53,0.1)]'
                  : 'bg-zinc-800 border-zinc-600 hover:border-zinc-400'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-none ${active ? 'bg-violet-400/20' : 'bg-zinc-700'}`}>
                  <Icon className={`w-5 h-5 ${active ? 'text-violet-400' : 'text-zinc-400'}`} />
                </div>
                <div>
                  <p className={`font-semibold text-sm mb-1 ${active ? 'text-violet-400' : 'text-zinc-200'}`}>{title}</p>
                  <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
