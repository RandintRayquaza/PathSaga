import { Check, X } from 'lucide-react';

const POINTS = [
  { text: 'Personalised to your unique profile',      us: true  },
  { text: 'AI-ranked career matches with reasoning',  us: true  },
  { text: 'Structured 3-phase action roadmap',        us: true  },
  { text: 'Adapts as your profile evolves',           us: true  },
  { text: 'Works for school and college students',    us: true  },
  { text: 'Generic one-size-fits-all advice',         us: false },
  { text: 'Information overload with no direction',   us: false },
];

export default function WhyPathSagaSection() {
  return (
    <section className="py-20 px-4 bg-ink-900/40" id="why" aria-labelledby="why-heading">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-lime-400 block mb-3">Why Us</span>
          <h2 id="why-heading" className="font-display text-3xl md:text-4xl text-ink-50">
            Why PathSaga is different
          </h2>
        </div>

        <div className="bg-ink-900 border border-ink-700 rounded-3xl overflow-hidden">
          {POINTS.map(({ text, us }, i) => (
            <div key={text} className={`flex items-center gap-4 px-6 py-4 ${i < POINTS.length - 1 ? 'border-b border-ink-800' : ''}`}>
              <div className={`flex-none w-6 h-6 rounded-full flex items-center justify-center ${us ? 'bg-lime-400/10 border border-lime-400/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                {us ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <X className="w-3.5 h-3.5 text-red-400" />}
              </div>
              <p className={`text-sm ${us ? 'text-ink-200 font-medium' : 'text-ink-500 line-through'}`}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
