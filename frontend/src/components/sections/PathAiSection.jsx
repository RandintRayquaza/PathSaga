import { BrainCircuit, Fingerprint, Map, Zap } from 'lucide-react';

export default function PathAiSection() {
  const steps = [
    {
      icon: Fingerprint,
      title: 'Context Engine',
      desc: 'Path AI doesn\'t just ask for your degree. It ingests your time constraints, existing domain knowledge, learning style, and specific goals to build a highly contextualized profile.'
    },
    {
      icon: Zap,
      title: 'Dynamic Assessment',
      desc: 'No static quizzes. Path AI generates questions on the fly, adapting to your target role to aggressively probe your actual competence, not just your confidence.'
    },
    {
      icon: Map,
      title: 'Trajectory Mapping',
      desc: 'It cross-references your skill gaps with current industry requirements to plot the shortest, most efficient route from your current state to job readiness.'
    },
    {
      icon: BrainCircuit,
      title: 'Continuous Coaching',
      desc: 'Integrated deeply into your dashboard, Path AI acts as a persistent mentor. Stuck on a Python concept? Need to prepare for an interview? The coach is context-aware and always available.'
    }
  ];

  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 bg-zinc-950 border-t border-zinc-900 overflow-hidden relative">
      
      {/* Background visual element */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] border border-zinc-900 rounded-full opacity-50" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] border border-zinc-800 rounded-full opacity-30" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          
          <div className="lg:col-span-4 flex flex-col justify-center">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-400 mb-4 block">
              Intelligence Layer
            </h2>
            <h3 className="font-display text-4xl md:text-5xl text-zinc-50 leading-tight mb-6">
              How <span className="text-transparent bg-clip-text bg-linear-to-r from-zinc-100 to-zinc-500">Path AI</span> thinks.
            </h3>
            <p className="text-zinc-400 text-base leading-relaxed">
              We built an intelligence layer that treats career growth not as a content problem, but as an engineering problem. It is designed to minimize your time-to-market.
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {steps.map((step, i) => (
                <div key={i} className="group p-6 rounded-2xl bg-zinc-900/20 hover:bg-zinc-900/50 border border-zinc-800/50 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center mb-6 border border-zinc-800 group-hover:border-violet-500/30 transition-colors">
                    <step.icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <h4 className="font-display text-lg text-zinc-100 mb-3">{step.title}</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
