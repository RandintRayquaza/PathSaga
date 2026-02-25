import { useDispatch, useSelector } from 'react-redux';
import { toggleInterest } from '../../redux/slices/onboardingSlice';

const INTERESTS = [
  'Technology & Coding',  'Design & Creativity',
  'Business & Finance',   'Science & Research',
  'Medicine & Health',    'Law & Justice',
  'Teaching & Education', 'Art & Culture',
  'Sports & Fitness',     'Writing & Journalism',
  'Environment & Nature', 'Entrepreneurship',
  'Psychology & Counselling', 'Architecture',
  'Music & Performing Arts',  'Engineering',
];

export default function OnboardingStep2() {
  const dispatch  = useDispatch();
  const interests = useSelector((s) => s.onboarding.interests);

  return (
    <div>
      <p className="text-sm font-medium text-zinc-300 mb-4">
        What topics genuinely excite you? <span className="text-zinc-500 font-normal">(select all that apply)</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {INTERESTS.map((interest) => {
          const active = interests.includes(interest);
          return (
            <button
              key={interest}
              onClick={() => dispatch(toggleInterest(interest))}
              className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-150 ${
                active
                  ? 'bg-violet-400 text-zinc-950 border-violet-400 font-semibold'
                  : 'bg-zinc-800 text-zinc-300 border-zinc-600 hover:border-violet-400/50'
              }`}
            >
              {interest}
            </button>
          );
        })}
      </div>
      {interests.length > 0 && (
        <p className="mt-4 text-xs text-zinc-500">{interests.length} selected</p>
      )}
    </div>
  );
}
