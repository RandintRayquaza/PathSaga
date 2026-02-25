import { CheckCircle2, XCircle } from 'lucide-react';

export default function WhyPathSagaSection() {
  const comparisons = [
    {
      bad: "Generic 'Top 10 Careers' articles.",
      good: "A personalized roadmap based on your exact skills.",
    },
    {
      bad: "Overwhelming bootcamp ads.",
      good: "Clear, phased steps prioritizing free and high-ROI learning.",
    },
    {
      bad: "Getting stuck on a bug and quitting.",
      good: "An always-on AI Coach to unblock your code and concepts.",
    },
    {
      bad: "Guessing what employers actually want.",
      good: "Data-backed milestones aligned with real industry demands.",
    }
  ];

  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-16 md:mb-24">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-400 mb-4 block">
            Why PathSaga
          </h2>
          <h3 className="font-display text-3xl md:text-5xl text-zinc-50 leading-tight max-w-2xl">
            We built what we wished we had when we graduated.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          
          {/* Generic/Bad Approach */}
          <div className="p-8 md:p-10 rounded-3xl bg-zinc-900/40 border border-zinc-800/50">
            <h4 className="text-zinc-500 font-medium mb-8 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500/50 block" /> 
              The Old Way
            </h4>
            <div className="space-y-6">
              {comparisons.map((item, i) => (
                <div key={i} className="flex items-start gap-4 opacity-60">
                  <XCircle className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" />
                  <p className="text-sm md:text-base text-zinc-400">{item.bad}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PathSaga Approach */}
          <div className="p-8 md:p-10 rounded-3xl bg-violet-600/5 border border-violet-500/20 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />
            
            <h4 className="text-violet-300 font-medium mb-8 flex items-center gap-3 relative z-10">
              <span className="w-2 h-2 rounded-full bg-violet-400 block shadow-[0_0_10px_rgba(167,139,250,0.8)]" /> 
              The PathSaga Way
            </h4>
            <div className="space-y-6 relative z-10">
              {comparisons.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                  <p className="text-sm md:text-base text-zinc-200">{item.good}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
