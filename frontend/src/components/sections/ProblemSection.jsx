import { AlertTriangle, Compass, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import IllustrationBlock from '../ui/IllustrationBlock';

const PROBLEMS = [
  { icon: AlertTriangle, title: 'problem.p1_title', desc: 'problem.p1_desc' },
  { icon: Compass,       title: 'problem.p2_title', desc: 'problem.p2_desc' },
  { icon: Layers,        title: 'problem.p3_title', desc: 'problem.p3_desc' },
];

export default function ProblemSection() {
  const { t } = useTranslation();
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8" id="problem" aria-labelledby="problem-heading">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Illustration */}
        <IllustrationBlock className="w-full h-80 md:h-[400px] order-2 md:order-1" label="Student confusion illustration" />

        {/* Content */}
        <div className="order-1 md:order-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-lime-400 block mb-4">{t('problem.tag')}</span>
          <h2 id="problem-heading" className="font-display text-3xl md:text-4xl text-ink-50 mb-10">
            {t('problem.title')}
          </h2>

          <div className="space-y-6">
            {PROBLEMS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="flex-none w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink-100 mb-1">{t(title)}</h3>
                  <p className="text-sm text-ink-400 leading-relaxed">{t(desc)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
