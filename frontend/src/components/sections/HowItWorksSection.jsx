const STEPS = [
  { num: '01', title: 'Create your account',      desc: 'Sign up in seconds and tell us a bit about your education and background.' },
  { num: '02', title: 'Complete the assessment',  desc: 'Answer a focused set of questions about your interests, values, and working style.' },
  { num: '03', title: 'Get your career match',    desc: 'AI analyses your profile and shows you the careers that align most with who you are.' },
  { num: '04', title: 'Follow your roadmap',      desc: 'Receive a 3-phase action plan with milestones, resources, and tasks — built for your journey.' },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 px-4" id="how-it-works" aria-labelledby="hiw-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-lime-400 block mb-3">Process</span>
          <h2 id="hiw-heading" className="font-display text-3xl md:text-4xl text-ink-50">
            How PathSaga works
          </h2>
          <p className="mt-3 text-ink-400 max-w-md mx-auto text-sm">
            From zero clarity to a confident, personalised direction.
          </p>
        </div>

        {/* Step grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map(({ num, title, desc }, i) => (
            <div key={num} className="relative">
              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%+10px)] w-5 h-px bg-ink-700" aria-hidden="true" />
              )}

              <div className="bg-ink-900 border border-ink-700 rounded-2xl p-5 h-full hover:border-lime-400/20 transition-colors">
                <span className="font-display text-4xl text-lime-400/20 block mb-3">{num}</span>
                <h3 className="font-semibold text-ink-100 mb-2">{title}</h3>
                <p className="text-sm text-ink-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
