import { AlertTriangle, Compass, Layers } from 'lucide-react';
import IllustrationBlock from '../ui/IllustrationBlock';

const PROBLEMS = [
  { icon: AlertTriangle, title: 'No clear direction', desc: 'Most students finish education without knowing which career actually fits their personality and strengths.' },
  { icon: Compass,       title: 'Generic advice everywhere', desc: 'One-size-fits-all guidance ignores what makes each person unique — and sets them up to feel stuck.' },
  { icon: Layers,        title: 'Overwhelming options', desc: 'Thousands of career paths, endless online advice, and no way to filter what truly applies to you.' },
];

export default function ProblemSection() {
  return (
    <section className="py-20 px-4" id="problem" aria-labelledby="problem-heading">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* Illustration */}
        <IllustrationBlock className="h-64 md:h-80 order-2 md:order-1" label="Student confusion illustration" />

        {/* Content */}
        <div className="order-1 md:order-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-lime-400 block mb-4">The Problem</span>
          <h2 id="problem-heading" className="font-display text-3xl md:text-4xl text-ink-50 mb-10">
            Why most career advice misses the mark
          </h2>

          <div className="space-y-6">
            {PROBLEMS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="flex-none w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink-100 mb-1">{title}</h3>
                  <p className="text-sm text-ink-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
