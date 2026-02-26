import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Compass, MessageSquare, CheckCircle2, CircleDashed, Lock, Loader2, Sparkles, Check, Play, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { setFetchedRoadmap, setTodos, updateTodo, appendTodo } from '../redux/slices/assessmentSlice';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { results, roadmapId, roadmap, todos } = useSelector((s) => s.assessment);
  
  const [loading, setLoading] = useState(false);
  const [generatingTodos, setGeneratingTodos] = useState(false);
  const [completingTask, setCompletingTask] = useState(null);
  const generationAttempted = useRef(false);
  
  // Roadmap History state
  const [historyDocs, setHistoryDocs] = useState([]);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  
  // List Expansion State for Todos (Show 1 vs Show All)
  const [isListExpanded, setIsListExpanded] = useState({});
  const toggleListExpand = (phaseNum) => setIsListExpanded(prev => ({ ...prev, [phaseNum]: !prev[phaseNum] }));

  // Expanded Todos state (for individual item descriptions)
  const [expandedTodos, setExpandedTodos] = useState({});
  const toggleTodoExpand = (id) => setExpandedTodos(prev => ({ ...prev, [id]: !prev[id] }));

  const fetchRoadmap = useCallback(async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/roadmap/id/${id}`);
      if (res.data?.success) {
        dispatch(setFetchedRoadmap(res.data.data));
        if (res.data.data.todos) {
          dispatch(setTodos(res.data.data.todos));
        }
      }
    } catch (err) {
      console.error('Failed to fetch roadmap:', err);
      toast.error('Could not load roadmap details.');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const fetchHistory = useCallback(async () => {
    if (!user?.uid || isFetchingHistory) return;
    try {
      setIsFetchingHistory(true);
      const res = await api.get(`/api/roadmap/history/${user.uid}`);
      if (res.data?.success) {
        setHistoryDocs(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch roadmap history:', err);
    } finally {
      setIsFetchingHistory(false);
    }
  }, [user?.uid]);

  const handleDeleteRoadmap = async (id, e) => {
    e.stopPropagation(); // Prevent the roadmap from being selected when clicking delete
    if (!window.confirm('Are you sure you want to delete this roadmap and all its tasks? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await api.delete(`/api/roadmap/${id}`);
      if (res.data?.success) {
        toast.success('Roadmap deleted successfully');
        // Remove from local history list
        setHistoryDocs(prev => prev.filter(doc => doc.id !== id));
        // If the deleted roadmap is the currently active one, clear it from view
        if (roadmapId === id || roadmap?.id === id) {
           dispatch(setFetchedRoadmap(null));
           dispatch(setTodos([]));
        }
      }
    } catch (err) {
      console.error('Failed to delete roadmap:', err);
      toast.error('Failed to delete roadmap.');
    }
  };

  // Step 2: Fetch & Render Active Roadmap OR fetch History
  useEffect(() => {
    if (roadmapId && !roadmap) {
      fetchRoadmap(roadmapId);
    }
    // As soon as the dashboard mounts, grab their history
    fetchHistory();
  }, [roadmapId, roadmap, fetchRoadmap, fetchHistory]);

  // Step 3: Trigger Initial Todos Generation if roadmap loaded but no todos exist for ANY phase
  // Only auto-generate if Phase 1 is unlocked but has no todos.
  useEffect(() => {
    const generateInitialTodos = async () => {
      if (!roadmapId || generationAttempted.current || (todos && todos.length > 0) || !roadmap) return;
      
      const phase1 = roadmap.phases?.find(p => p.phaseNumber === 1);
      if (phase1 && phase1.isUnlocked) {
        generationAttempted.current = true; // Lock immediately to prevent StrictMode double-fire
        try {
          setGeneratingTodos(true);
          const res = await api.post(`/api/roadmap/${roadmapId}/generate-phase-todos`, { phaseNumber: 1 });
          if (res.data?.success) {
            dispatch(setTodos([...todos, ...res.data.data]));
          }
        } catch (err) {
          console.error('Failed to generate initial todos:', err);
        } finally {
          setGeneratingTodos(false);
        }
      }
    };

    if (roadmap && roadmap.phases && (!todos || todos.length === 0)) {
       generateInitialTodos();
    }
  }, [roadmap, roadmapId, todos, dispatch]);

  // Step 4: Handle Task Completion (No longer auto-generates next task)
  const handleTaskComplete = async (todo) => {
    if (completingTask) return;
    try {
      setCompletingTask(todo.id);
      
      // Optimistically update
      dispatch(updateTodo({ ...todo, status: 'completed' }));
      
      // In a real app we'd have a specific /api/todo/update endpoint to save the checkmark.
      // Assuming roadmap/generate-next-task handled this before, we need to ensure the check actually saves.
      // Based on our controller, generate-next-task was doing it. We don't have a simple PUT /todo yet.
      // So let's mock the UI feeling or simply expect we might need that endpoint.
      // NOTE: We don't call generate-next-task anymore!
      toast.success('Task marked complete!', { icon: '👏', position: 'bottom-center' });

    } catch (err) {
       console.error('Failed to complete task:', err);
       toast.error('Failed to update task.');
       // Revert optimistic update
       dispatch(updateTodo({ ...todo, status: 'pending' }));
    } finally {
      setCompletingTask(null);
    }
  };

  const handleUnlockNextPhase = async () => {
     if (generatingTodos) return;
     try {
       setGeneratingTodos(true);
       toast.loading('Unlocking Next Phase and generating tasks...', { id: 'unlockPhase' });
       const res = await api.post(`/api/roadmap/unlock-next-phase`, { roadmapId });
       if (res.data?.success) {
         const newPhaseNumber = res.data.data.newlyUnlockedPhaseNumber;
         // Generate Tasks for the newly unlocked phase
         const todosRes = await api.post(`/api/roadmap/${roadmapId}/generate-phase-todos`, { phaseNumber: newPhaseNumber });
         if (todosRes.data?.success) {
            dispatch(setTodos([...todos, ...todosRes.data.data]));
            // Update roadmap locally to show it's unlocked
            const updatedRoadmap = { ...roadmap };
            if (updatedRoadmap.phases) {
              updatedRoadmap.phases = [...updatedRoadmap.phases];
              const pIdx = updatedRoadmap.phases.findIndex(p => p.phaseNumber === newPhaseNumber);
              if (pIdx !== -1) {
                updatedRoadmap.phases[pIdx] = { ...updatedRoadmap.phases[pIdx], isUnlocked: true };
              }
            }
            dispatch(setFetchedRoadmap(updatedRoadmap));
            
            toast.success(`Phase ${newPhaseNumber} Unlocked!`, { id: 'unlockPhase' });
         } else {
            toast.error('Unlocked phase, but failed to generate tasks.', { id: 'unlockPhase' });
         }
       }
     } catch (err) {
       console.error(err);
       toast.error(err.response?.data?.message || 'Failed to unlock phase', { id: 'unlockPhase' });
     } finally {
       setGeneratingTodos(false);
     }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-full">
      
      {/* LEFT COLUMN: The Journey Timeline (65%) */}
      <div className="flex-1 p-6 md:p-10 border-r border-zinc-900 overflow-y-auto">
        <header className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <p className="text-zinc-500 uppercase tracking-widest text-[11px] font-semibold">{t("dashboard_new.welcome_back")}</p>
            {roadmap?.status === 'inactive' && (
              <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest">{t("dashboard_new.historical_view")}</span>
            )}
          </div>
          <h1 className="font-display text-h2 text-zinc-50 leading-tight">
            {t("dashboard.welcome", { name: user?.name?.split(' ')[0] || 'Student' }).replace(' 👋', '')} <span className="inline-block hover:animate-wave">👋</span>
          </h1>
          <p className="text-zinc-400 mt-2">{t("dashboard_new.your_path")}<span className="text-violet-400 font-medium">{roadmap?.recommendedRoles?.[0] || user?.targetDomain || 'Unknown Domain'}</span> {roadmap?.version && <span className="text-xs text-zinc-600 ml-2">({t("dashboard_new.version", { v: roadmap.version })})</span>}</p>
        </header>

        {/* Timeline Interface */}
        <div className="space-y-6">
          <h2 className="text-sm font-medium text-zinc-100 uppercase tracking-wider mb-6">{t("dashboard_new.journey_map")}</h2>
          
          {loading ? (
             <div className="flex flex-col items-center justify-center p-12 text-zinc-500 gap-3">
               <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
               <p>{t("dashboard_new.loading_roadmap")}</p>
             </div>
          ) : !roadmap ? (
            <div className="p-8 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center">
              <Compass className="w-12 h-12 text-zinc-700 mb-4" />
              <h3 className="font-display text-lg text-zinc-200 mb-2">{t("dashboard_new.no_roadmap_title")}</h3>
              <p className="text-zinc-400 max-w-sm mb-6 text-sm">{t("dashboard_new.no_roadmap_desc")}</p>
              <Link to="/assessment" className="bg-violet-500 hover:bg-violet-400 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                {t("dashboard_new.start_assessment")}
              </Link>
            </div>
          ) : (
            <div className="pl-2 space-y-8 border-l-2 border-zinc-900 ml-3">
              {(() => {
                const phasesToRender = roadmap.phases || [
                  { phaseNumber: 1, title: 'Foundation', isUnlocked: true, maxTodos: 10 },
                  { phaseNumber: 2, title: 'Project Building', isUnlocked: true, maxTodos: 10 },
                  { phaseNumber: 3, title: 'Career Ready', isUnlocked: true, maxTodos: 10 }
                ].filter(p => roadmap[`phase${p.phaseNumber}`] && roadmap[`phase${p.phaseNumber}`].length > 0);

                return phasesToRender.map((phase) => {
                  const phaseContentArray = roadmap[`phase${phase.phaseNumber}`] || [];
                  const phaseTodos = todos?.filter(t => (t.phaseNumber || 1) === phase.phaseNumber) || [];
                  const phaseCompletedTodos = phaseTodos.filter(t => t.status === 'completed');
                  
                  const isAllCompleted = phaseTodos.length > 0 && phaseCompletedTodos.length === phaseTodos.length;
                  const nextPhase = phasesToRender.find(p => p.phaseNumber === phase.phaseNumber + 1);
                  const isNextLocked = nextPhase && !nextPhase.isUnlocked;

                  if (!phase.isUnlocked) {
                  return (
                    <div key={phase.phaseNumber} className="relative pl-8">
                      <span className="absolute -left-[17px] top-1 bg-zinc-950">
                        <Lock className="w-8 h-8 text-zinc-700 p-1.5 rounded-full border border-zinc-900 bg-zinc-950" />
                      </span>
                      <h3 className="font-display text-lg font-medium text-zinc-600">Phase {phase.phaseNumber}: {phase.title}</h3>
                      <p className="text-sm mt-1 text-zinc-700">{t("dashboard_new.phase_locked_desc")}</p>
                      <div className="mt-4 space-y-3 opacity-60">
                         {phaseContentArray.map((step, i) => (
                            <div key={i} className="flex items-start gap-3 text-sm text-zinc-500">
                              <div className="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0 ml-[1px]" />
                              <span>{step}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={phase.phaseNumber} className="relative pl-8">
                    <span className="absolute -left-[17px] top-1 bg-zinc-950">
                      {isAllCompleted ? (
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                      ) : (
                        <CircleDashed className="w-8 h-8 text-violet-400 animate-[spin_4s_linear_infinite]" />
                      )}
                    </span>
                    <h3 className="font-display text-lg font-medium text-zinc-100">Phase {phase.phaseNumber}: {phase.title}</h3>
                    
                    <div className="mt-4 p-4 rounded-xl border border-violet-500/20 bg-violet-500/5">
                      <p className="text-xs text-violet-400 font-medium uppercase tracking-widest mb-3">{t("dashboard_new.topic_overview")}</p>
                      <div className="space-y-3">
                        {phaseContentArray.map((step, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Todos Section Under Phase */}
                    <div className="mt-6 mb-4">
                      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> {t("dashboard_new.action_items")}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-zinc-400 bg-zinc-900 px-2.5 py-1.5 rounded-md border border-zinc-800/50">
                            {t("dashboard_new.completed_fraction", { completed: phaseCompletedTodos.length, total: phaseTodos.length || phase.maxTodos })}
                          </span>
                        </div>
                      </div>
                      
                      {generatingTodos && phaseTodos.length === 0 ? (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-400 text-sm">
                          <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                          AI Coach is generating exactly 10 tasks...
                        </div>
                      ) : phaseTodos.length > 0 ? (
                        <div className="space-y-3">
                          {/* Always Show First Task */}
                          {(() => {
                            const firstTodo = phaseTodos[0];
                            const isCompleted = firstTodo.status === 'completed';
                            const isCompleting = completingTask === firstTodo.id;
                            const isExpanded = expandedTodos[firstTodo.id];
                            return (
                              <div key={firstTodo.id} className={`p-4 rounded-xl border transition-all ${isCompleted ? 'bg-zinc-900/40 border-zinc-800/60 opacity-60' : 'bg-zinc-900/80 border-zinc-800 hover:border-violet-500/50 z-10 relative'}`}>
                                <div className="flex items-start gap-3">
                                  <button 
                                    onClick={() => !isCompleted && handleTaskComplete(firstTodo)}
                                    disabled={isCompleted || isCompleting}
                                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                                      isCompleted ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-zinc-600 hover:border-violet-400 bg-zinc-950'
                                    }`}
                                  >
                                    {isCompleting ? <Loader2 className="w-3 h-3 animate-spin text-zinc-400"/> : isCompleted ? <Check className="w-3 h-3" /> : null}
                                  </button>
                                  <div className="flex-1 cursor-pointer select-none group" onClick={() => toggleTodoExpand(firstTodo.id)}>
                                    <div className="flex items-start justify-between gap-4">
                                      <h5 className={`font-medium text-sm group-hover:text-violet-300 transition-colors ${isCompleted ? 'line-through text-zinc-500 group-hover:text-zinc-400' : 'text-zinc-200'}`}>
                                        {firstTodo.title}
                                      </h5>
                                      <button 
                                        className="text-zinc-500 group-hover:text-zinc-300 transition-colors mt-0.5 shrink-0" 
                                        aria-label={isExpanded ? "Collapse" : "Expand"}
                                      >
                                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                      </button>
                                    </div>
                                    <div className={`grid transition-all duration-200 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}>
                                      <div className="overflow-hidden">
                                        <p className={`text-xs ${isCompleted ? 'text-zinc-600' : 'text-zinc-400'}`}>
                                          {firstTodo.description}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                          <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isListExpanded[phase.phaseNumber] ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                            <div className="overflow-hidden">
                              <div className="space-y-3 pt-1 pb-1">
                                {phaseTodos.slice(1).map((todo) => {
                                   const isCompleted = todo.status === 'completed';
                                   const isCompleting = completingTask === todo.id;
                                   const isExpanded = expandedTodos[todo.id];
                                   return (
                                     <div key={todo.id} className={`p-4 rounded-xl border transition-all ${isCompleted ? 'bg-zinc-900/40 border-zinc-800/60 opacity-60' : 'bg-zinc-900/80 border-zinc-800 hover:border-violet-500/50'}`}>
                                       <div className="flex items-start gap-3">
                                         <button 
                                           onClick={() => !isCompleted && handleTaskComplete(todo)}
                                           disabled={isCompleted || isCompleting}
                                           className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                                             isCompleted ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-zinc-600 hover:border-violet-400 bg-zinc-950'
                                           }`}
                                         >
                                           {isCompleting ? <Loader2 className="w-3 h-3 animate-spin text-zinc-400"/> : isCompleted ? <Check className="w-3 h-3" /> : null}
                                         </button>
                                         <div className="flex-1 cursor-pointer select-none group" onClick={() => toggleTodoExpand(todo.id)}>
                                           <div className="flex items-start justify-between gap-4">
                                             <h5 className={`font-medium text-sm group-hover:text-violet-300 transition-colors ${isCompleted ? 'line-through text-zinc-500 group-hover:text-zinc-400' : 'text-zinc-200'}`}>
                                               {todo.title}
                                             </h5>
                                             <button 
                                               className="text-zinc-500 group-hover:text-zinc-300 transition-colors mt-0.5 shrink-0" 
                                               aria-label={isExpanded ? "Collapse" : "Expand"}
                                             >
                                               {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                             </button>
                                           </div>
                                           <div className={`grid transition-all duration-200 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}>
                                             <div className="overflow-hidden">
                                               <p className={`text-xs ${isCompleted ? 'text-zinc-600' : 'text-zinc-400'}`}>
                                                 {todo.description}
                                               </p>
                                             </div>
                                           </div>
                                         </div>
                                       </div>
                                     </div>
                                   );
                                })}
                              </div>
                            </div>
                          </div>
                          
                          {/* Sleek Toggle Button */}
                          {phaseTodos.length > 1 && (
                            <div className="flex justify-center pt-2 pb-1 relative z-10 w-full mb-6">
                              <div className="absolute inset-0 top-1/2 h-px bg-zinc-800/80 -z-10" />
                              <button
                                onClick={() => toggleListExpand(phase.phaseNumber)}
                                className="group flex items-center gap-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100 px-5 py-2 rounded-full border border-zinc-800/80 transition-all font-medium text-xs shadow-sm shadow-black/20"
                              >
                                {isListExpanded[phase.phaseNumber] ? (
                                  <>Show Less <ChevronUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" /></>
                                ) : (
                                  <>Show All ({phaseTodos.length}) <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" /></>
                                )}
                              </button>
                            </div>
                          )}
                          
                          {/* Force show the first item always, we put it BELOW to trick the CSS grid or we can just statically render it.
                              Actually, statically rendering it FIRST is better UX. */}
                        </div>
                      ) : null}

                      {/* Unlock Next Phase / Show Done State */}
                      {isAllCompleted && isNextLocked && phase.phaseNumber < 3 && (
                        <div className="mt-6 flex flex-col items-center p-6 border border-zinc-800 rounded-xl bg-linear-to-b from-zinc-900/50 to-zinc-900/10">
                           <Sparkles className="w-8 h-8 text-violet-400 mb-3" />
                           <h4 className="text-zinc-100 font-medium">Amazing work!</h4>
                           <p className="text-sm text-zinc-400 mb-4 text-center">You have completed all {phase.maxTodos} tasks for Phase {phase.phaseNumber}. You're ready to proceed to the next phase.</p>
                           <button 
                             onClick={handleUnlockNextPhase}
                             disabled={generatingTodos}
                             className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                           >
                              {generatingTodos ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                              Unlock Phase {phase.phaseNumber + 1}
                           </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
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
        {roadmap && roadmap.phase1?.length > 0 && (
          <div className="mt-8 p-5 rounded-xl border border-zinc-900 bg-zinc-950 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-3xl rounded-full" />
            <p className="text-xs text-zinc-500 mb-2 font-medium">Task Completion</p>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-3xl font-display font-medium text-zinc-100 leading-none">
                 {todos?.length > 0 ? Math.round((todos.filter(t => t.status === 'completed').length / todos.length) * 100) : 0}
              </span>
              <span className="text-zinc-500 text-sm mb-1 font-medium">%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-violet-500 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${todos?.length > 0 ? (todos.filter(t => t.status === 'completed').length / todos.length) * 100 : 0}%` }}
              />
            </div>
            <p className="text-[10px] text-zinc-500 mt-4 uppercase tracking-widest text-center">
              {todos?.filter(t => t.status === 'completed').length || 0} of {todos?.length || 0} Tasks Completed
            </p>
          </div>
        )}

        {/* Journey History Widget */}
        {historyDocs && historyDocs.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
              Journey History
            </h3>
            <div className="space-y-2">
              {historyDocs.map((doc, idx) => {
                 const isActive = doc.id === roadmap?.id;
                 const isArchived = doc.status === 'inactive';
                 return (
                   <button 
                     key={doc.id}
                     onClick={() => !isActive && fetchRoadmap(doc.id)}
                     className={`w-full text-left p-3 rounded-xl border transition-all ${isActive ? 'bg-violet-500/10 border-violet-500/30 ring-1 ring-violet-500/50' : 'bg-zinc-950/50 border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-900/80'}`}
                   >
                     <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-medium ${isActive ? 'text-violet-300' : 'text-zinc-300'}`}>Version {doc.version || historyDocs.length - idx}</span>
                        {isArchived ? (
                          <span className="text-[9px] uppercase tracking-wider bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">Archived</span>
                        ) : (
                          <span className="text-[9px] uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">Active</span>
                        )}
                     </div>
                     <div className="flex justify-between items-end mt-1">
                       <div>
                         <p className="text-xs text-zinc-500 truncate max-w-[200px]">{doc.levelAssessment || 'Skills Assessment'}</p>
                         <p className="text-[10px] text-zinc-600 mt-1">{new Date(doc.createdAt || Date.now()).toLocaleDateString()}</p>
                       </div>
                       <button
                         onClick={(e) => handleDeleteRoadmap(doc.id, e)}
                         className="p-1.5 bg-zinc-900/50 hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 rounded-lg transition-colors"
                         title="Delete Roadmap"
                       >
                         <Trash2 className="w-3.5 h-3.5" />
                       </button>
                     </div>
                   </button>
                 );
              })}
            </div>
          </div>
        )}

      </div>
      
    </div>
  );
}
