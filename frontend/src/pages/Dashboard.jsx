import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Compass, MessageSquare, CheckCircle2, CircleDashed, Lock } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth);
  const { results, loading: loadingResults } = useSelector((s) => s.assessment);
  
  // Dummy timeline data acting as the new structural core
  const timeline = [
    { id: 1, title: 'Foundation', status: 'done', desc: 'Core logic and problem solving.' },
    { id: 2, title: 'Core Skills', status: 'current', desc: 'Python, Data Structures, Web Basics.' },
    { id: 3, title: 'Specialization', status: 'locked', desc: 'Advanced frameworks and system design.' },
    { id: 4, title: 'Career Ready', status: 'locked', desc: 'Interview prep and portfolio building.' }
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-full">
      
      {/* LEFT COLUMN: The Journey Timeline (65%) */}
      <div className="flex-1 p-6 md:p-10 border-r border-zinc-900 overflow-y-auto">
        <header className="mb-12">
          <p className="text-zinc-500 uppercase tracking-widest text-[11px] font-semibold mb-2">Welcome Back</p>
          <h1 className="font-display text-h2 text-zinc-50 leading-tight">Hey, {user?.name?.split(' ')[0] || 'Student'}</h1>
          <p className="text-zinc-400 mt-2">Your path: <span className="text-violet-400 font-medium">{results?.recommendedRoles?.[0] || 'Unknown Domain'}</span></p>
        </header>

        {/* Timeline Interface */}
        <div className="space-y-6">
          <h2 className="text-sm font-medium text-zinc-100 uppercase tracking-wider mb-6">Your Journey Map</h2>
          
          {!results || (!results.phase1?.length && !results.phase2?.length) ? (
            <div className="p-8 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center">
              <Compass className="w-12 h-12 text-zinc-700 mb-4" />
              <h3 className="font-display text-lg text-zinc-200 mb-2">No Roadmap Generated Yet</h3>
              <p className="text-zinc-400 max-w-sm mb-6 text-sm">You haven't taken the career assessment yet. Complete it to generate your personalized step-by-step roadmap.</p>
              <Link to="/assessment" className="bg-violet-500 hover:bg-violet-400 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                Start Assessment
              </Link>
            </div>
          ) : (
            <div className="pl-2 space-y-8 border-l-2 border-zinc-900 ml-3">
              {/* Phase 1 */}
              <div className="relative pl-8">
                <span className="absolute -left-[17px] top-1 bg-zinc-950">
                  <CircleDashed className="w-8 h-8 text-violet-400 animate-[spin_4s_linear_infinite]" />
                </span>
                <h3 className="font-display text-lg font-medium text-zinc-100">Phase 1: Foundation</h3>
                <p className="text-sm mt-1 text-zinc-400">Core skills and fundamentals.</p>
                <div className="mt-4 p-4 rounded-xl border border-violet-500/20 bg-violet-500/5">
                  <p className="text-xs text-violet-400 font-medium uppercase tracking-widest mb-3">In Progress</p>
                  <div className="space-y-3">
                    {results.phase1?.map((step, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="relative pl-8">
                <span className="absolute -left-[17px] top-1 bg-zinc-950">
                  <Lock className="w-8 h-8 text-zinc-700 p-1.5 rounded-full border border-zinc-900 bg-zinc-950" />
                </span>
                <h3 className="font-display text-lg font-medium text-zinc-600">Phase 2: Project Building</h3>
                <p className="text-sm mt-1 text-zinc-700">Real-world applications.</p>
                <div className="mt-4 space-y-3 opacity-60">
                   {results.phase2?.map((step, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-zinc-500">
                        <div className="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0 ml-[1px]" />
                        <span>{step}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Phase 3 */}
              {results.phase3?.length > 0 && (
                <div className="relative pl-8">
                  <span className="absolute -left-[17px] top-1 bg-zinc-950">
                    <Lock className="w-8 h-8 text-zinc-700 p-1.5 rounded-full border border-zinc-900 bg-zinc-950" />
                  </span>
                  <h3 className="font-display text-lg font-medium text-zinc-600">Phase 3: Career Ready</h3>
                  <p className="text-sm mt-1 text-zinc-700">Interview prep and portfolio.</p>
                  <div className="mt-4 space-y-3 opacity-60">
                     {results.phase3?.map((step, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm text-zinc-500">
                          <div className="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0 ml-[1px]" />
                          <span>{step}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Quick Actions (35%) */}
      <div className="w-full lg:w-[380px] p-6 md:p-10 bg-zinc-900/20 overflow-y-auto">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-6">Action Center</h2>
        
        <div className="flex flex-col gap-3">
          <Link to="/aichat" className="group flex items-center justify-between p-4 rounded-xl bg-violet-500 hover:bg-violet-400 transition-colors">
            <div className="flex items-center gap-3 text-white">
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium text-sm">Talk to AI Coach</span>
            </div>
            <span className="text-violet-200 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>

          <Link to="/assessment" className="group flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-3 text-zinc-300 group-hover:text-zinc-100 transition-colors">
              <Compass className="w-5 h-5" />
              <span className="font-medium text-sm">{results && (results.phase1?.length > 0) ? 'Retake Assessment' : 'Start Assessment'}</span>
            </div>
          </Link>

          <Link to="/profile" className="group flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-3 text-zinc-300 group-hover:text-zinc-100 transition-colors">
              <div className="w-5 h-5 rounded overflow-hidden bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500 uppercase">
                {user?.name?.[0] || 'P'}
              </div>
              <span className="font-medium text-sm">Edit Profile Details</span>
            </div>
          </Link>
        </div>

        {/* Progress summary widget */}
        {results && results.phase1?.length > 0 && (
          <div className="mt-8 p-5 rounded-xl border border-zinc-900 bg-zinc-950">
            <p className="text-xs text-zinc-500 mb-2">Overall Completion</p>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-3xl font-display font-medium text-zinc-100 leading-none">15</span>
              <span className="text-zinc-500 text-sm mb-1">%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-violet-500 w-[15%]" />
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
}
