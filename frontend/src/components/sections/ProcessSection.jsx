export default function ProcessSection() {
  const steps = [
    { 
      title: 'Problem', 
      headline: 'The gap between education and employment is widening.',
      desc: 'You graduate with a degree but no clear direction. The overwhelming amount of generic advice leaves you paralyzed.' 
    },
    { 
      title: 'Clarity', 
      headline: 'Your unique profile, analyzed instantly.',
      desc: 'We replace generic advice with a 2-minute assessment that maps your specific skills, constraints, and interests to viable career trajectories.' 
    },
    { 
      title: 'Solution', 
      headline: 'A step-by-step path from here to hired.',
      desc: 'PathSaga generates a phased roadmap tailored exactly to your level. No fluff, just the exact tools, projects, and steps you need.' 
    },
    { 
      title: 'Action', 
      headline: 'Never get stuck again.',
      desc: 'Your personalized AI Coach is always available to unblock you, explain complex concepts, and guide you through your roadmap.' 
    },
  ];

  return (
    <section className="py-32 md:py-48 px-4 sm:px-6 md:px-12 lg:px-24 bg-zinc-950 relative">
      <div className="max-w-4xl mx-auto relative">
        
        {/* Subtle vertical line connecting stages */}
        <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-zinc-950 via-zinc-800 to-zinc-950 hidden sm:block md:-translate-x-1/2" />

        <div className="space-y-32 md:space-y-48">
          {steps.map((step, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div key={step.title} className={`relative flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-24 items-start`}>
                
                {/* Visual Node */}
                <div className="absolute left-0 md:left-1/2 top-2 md:top-6 w-[30px] h-px bg-zinc-700 hidden sm:block md:-translate-x-1/2">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
                </div>

                <div className="flex-1 pl-12 sm:pl-0 md:px-0" style={{ textAlign: isEven ? 'right' : 'left' }}>
                  <span className={`text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-violet-400 mb-4 block ${!isEven ? 'md:text-left' : 'md:text-right'} text-left`}>
                    0{idx + 1} // {step.title}
                  </span>
                  <h3 className={`font-display text-2xl md:text-3xl lg:text-4xl text-zinc-100 mb-4 leading-[1.2] tracking-tight ${!isEven ? 'md:text-left' : 'md:text-right'} text-left`}>
                    {step.headline}
                  </h3>
                  <p className={`text-zinc-500 text-sm md:text-base leading-relaxed max-w-sm ${!isEven ? 'md:ml-0 md:mr-auto' : 'md:ml-auto md:mr-0'} text-left`}>
                    {step.desc}
                  </p>
                </div>
                
                {/* Empty spacer for grid alignment */}
                <div className="flex-1 hidden md:block" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
