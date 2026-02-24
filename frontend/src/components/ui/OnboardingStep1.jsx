import { useDispatch, useSelector } from 'react-redux';
import { setEducationType, setField, toggleSubject } from '../../redux/slices/onboardingSlice';

const SCHOOL_CLASSES  = ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
const SCHOOL_SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Economics', 'Computer Science', 'English Literature', 'Commerce'];
const COLLEGE_YEARS   = ['1st Year / Sem 1-2', '2nd Year / Sem 3-4', '3rd Year / Sem 5-6', '4th Year / Sem 7-8', 'Postgraduate'];
const COLLEGE_BRANCHES = ['Computer Science', 'Mechanical Engineering', 'Electronics', 'Civil Engineering', 'Business Administration', 'Arts & Humanities', 'Science', 'Law', 'Medicine', 'Design'];

function ChipSelect({ options, selected, onSelect, multi = false }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = multi ? selected.includes(opt) : selected === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-150 ${
              active
                ? 'bg-lime-400 text-ink-950 border-lime-400 font-semibold'
                : 'bg-ink-800 text-ink-300 border-ink-600 hover:border-lime-400/50'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function OnboardingStep1() {
  const dispatch = useDispatch();
  const { educationType, classLevel, yearSemester, branch, subjects } = useSelector((s) => s.onboarding);

  return (
    <div className="space-y-8">

      {/* Education type */}
      <div>
        <p className="text-sm font-medium text-ink-300 mb-3">Are you currently in school or college?</p>
        <div className="grid grid-cols-2 gap-3">
          {['school', 'college'].map((type) => (
            <button
              key={type}
              onClick={() => dispatch(setEducationType(type))}
              className={`py-4 rounded-xl border text-sm font-medium capitalize transition-all ${
                educationType === type
                  ? 'bg-lime-400 text-ink-950 border-lime-400'
                  : 'bg-ink-800 border-ink-600 text-ink-300 hover:border-lime-400/50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* School-specific */}
      {educationType === 'school' && (
        <>
          <div>
            <p className="text-sm font-medium text-ink-300 mb-3">Which class are you in?</p>
            <ChipSelect options={SCHOOL_CLASSES} selected={classLevel} onSelect={(v) => dispatch(setField({ key: 'classLevel', value: v }))} />
          </div>
          <div>
            <p className="text-sm font-medium text-ink-300 mb-3">Select your subjects <span className="text-ink-500 font-normal">(pick all that apply)</span></p>
            <ChipSelect options={SCHOOL_SUBJECTS} selected={subjects} onSelect={(v) => dispatch(toggleSubject(v))} multi />
          </div>
        </>
      )}

      {/* College-specific */}
      {educationType === 'college' && (
        <>
          <div>
            <p className="text-sm font-medium text-ink-300 mb-3">Which year / semester are you in?</p>
            <ChipSelect options={COLLEGE_YEARS} selected={yearSemester} onSelect={(v) => dispatch(setField({ key: 'yearSemester', value: v }))} />
          </div>
          <div>
            <p className="text-sm font-medium text-ink-300 mb-3">What is your branch or field?</p>
            <ChipSelect options={COLLEGE_BRANCHES} selected={branch} onSelect={(v) => dispatch(setField({ key: 'branch', value: v }))} />
          </div>
        </>
      )}
    </div>
  );
}
