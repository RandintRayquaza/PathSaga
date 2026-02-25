export default function WhoItsForSection() {
  const personas = [
    {
      title: 'School Students',
      desc: 'Still in 11th or 12th? Figure out which stream or degree actually maps to a career you will enjoy, before you commit years of your life to it.'
    },
    {
      title: 'College Students',
      desc: 'Realize your syllabus won\'t get you hired? Get a parallel, practical roadmap to build the portfolio companies actually filter out resumes for.'
    },
    {
      title: 'Career Switchers',
      desc: 'Trapped in a field you hate? Map your existing transferable skills to a new domain, and get the exact steps to bridge the gap without starting from absolute zero.'
    },
    {
      title: 'First-Gen Learners',
      desc: 'No corporate network or "uncle in IT" to ask? PathSaga gives you the insider knowledge and structural guidance that others inherit by default.'
    }
  ];

  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 border-t border-zinc-900 bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-400 mb-4 block">
            Who It's For
          </h2>
          <h3 className="font-display text-3xl md:text-5xl text-zinc-50 leading-tight max-w-2xl mx-auto">
            Not for everyone. Just those who want agency.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          {personas.map((p, i) => (
            <div key={i} className="flex flex-col border-t border-zinc-800 pt-6">
              <span className="text-zinc-600 font-display font-medium text-lg mb-2">0{i + 1}</span>
              <h4 className="font-display text-2xl text-zinc-100 mb-4">{p.title}</h4>
              <p className="text-zinc-400 leading-relaxed text-sm md:text-base max-w-md">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
