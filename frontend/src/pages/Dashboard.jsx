import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setCareerFit, setSkillGaps, setRoadmap, setTasks } from '../redux/slices/userSlice';
import { MOCK_CAREER_FIT, MOCK_SKILL_GAPS, MOCK_ROADMAP, MOCK_TASKS } from '../utils/mockDashboard';
import Navbar          from '../components/layout/Navbar';
import CareerFitSection from '../components/ui/CareerFitSection';
import SkillGapSection  from '../components/ui/SkillGapSection';
import RoadmapSection   from '../components/ui/RoadmapSection';
import TasksSection     from '../components/ui/TasksSection';
import { ClipboardCheck } from 'lucide-react';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { careerFit, skillGaps, roadmap, tasks } = useSelector((s) => s.user);
  const user = useSelector((s) => s.auth.user);
  const assessmentComplete = useSelector((s) => s.assessment.completed);

  /* Load mock data — replace this block with real API calls */
  useEffect(() => {
    if (assessmentComplete && !careerFit) {
      dispatch(setCareerFit(MOCK_CAREER_FIT));
      dispatch(setSkillGaps(MOCK_SKILL_GAPS));
      dispatch(setRoadmap(MOCK_ROADMAP));
      dispatch(setTasks(MOCK_TASKS));
    }
  }, [assessmentComplete]);

  const name = user?.name || 'there';

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ink-950 pt-20 pb-12 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Page header */}
          <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-2xl md:text-3xl text-ink-50">
                Hey, {name} 👋
              </h1>
              <p className="text-sm text-ink-400 mt-1">Here's your career dashboard.</p>
            </div>
            <Link to="/assessment">
              <button className="flex items-center gap-2 text-sm border border-ink-600 text-ink-300 hover:border-lime-400/50 hover:text-lime-400 px-4 py-2 rounded-full transition-all">
                <ClipboardCheck className="w-4 h-4" />
                {assessmentComplete ? 'Retake Assessment' : 'Take Assessment'}
              </button>
            </Link>
          </header>

          {/* Assessment prompt banner (if not done) */}
          {!assessmentComplete && (
            <div className="mb-6 bg-lime-400/5 border border-lime-400/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-ink-100 text-sm">Complete your career assessment</p>
                <p className="text-sm text-ink-400 mt-0.5">Answer a few questions to unlock your personalised career match and roadmap.</p>
              </div>
              <Link to="/assessment">
                <button className="flex-none bg-lime-400 text-ink-950 font-semibold text-sm px-5 py-2 rounded-full hover:bg-lime-300 transition-colors">
                  Start Now
                </button>
              </Link>
            </div>
          )}

          {/* Dashboard grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* Career Fit — spans 2 cols on lg */}
            <div className="lg:col-span-2">
              <CareerFitSection data={careerFit} />
            </div>

            {/* Skill Gap */}
            <SkillGapSection gaps={skillGaps} />

            {/* Roadmap — spans 2 cols on lg */}
            <div className="lg:col-span-2">
              <RoadmapSection roadmap={roadmap} />
            </div>

            {/* Tasks */}
            <TasksSection tasks={tasks} />
          </div>
        </div>
      </main>
    </>
  );
}
