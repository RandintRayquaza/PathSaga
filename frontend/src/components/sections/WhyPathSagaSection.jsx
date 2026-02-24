import { Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const POINTS = [
  { text: 'why.p1', us: true  },
  { text: 'why.p2', us: true  },
  { text: 'why.p3', us: true  },
  { text: 'why.p4', us: true  },
  { text: 'why.p5', us: true  },
  { text: 'why.c1', us: false },
  { text: 'why.c2', us: false },
];

export default function WhyPathSagaSection() {
  const { t } = useTranslation();
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-ink-900/40" id="why" aria-labelledby="why-heading">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-lime-400 block mb-3">{t('why.tag')}</span>
          <h2 id="why-heading" className="font-display text-3xl md:text-4xl text-ink-50">
            {t('why.title')}
          </h2>
        </div>

        <div className="bg-ink-900 border border-ink-700 rounded-3xl overflow-hidden">
          {POINTS.map(({ text, us }, i) => (
            <div key={text} className={`flex items-center gap-4 px-6 md:px-8 py-4 md:py-5 ${i < POINTS.length - 1 ? 'border-b border-ink-800' : ''}`}>
              <div className={`flex-none w-6 h-6 rounded-full flex items-center justify-center ${us ? 'bg-lime-400/10 border border-lime-400/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                {us ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <X className="w-3.5 h-3.5 text-red-400" />}
              </div>
              <p className={`text-sm ${us ? 'text-ink-200 font-medium' : 'text-ink-500 line-through'}`}>{t(text)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
