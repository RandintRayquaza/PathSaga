import { ClipboardCheck, Zap, TrendingUp, Map, Mic } from 'lucide-react';

import { useTranslation } from 'react-i18next';

const FEATURES = [
  { icon: ClipboardCheck, title: 'features.f1_title', desc: 'features.f1_desc', tag: 'features.f1_tag' },
  { icon: Zap,            title: 'features.f2_title', desc: 'features.f2_desc', tag: 'features.f2_tag' },
  { icon: TrendingUp,     title: 'features.f3_title', desc: 'features.f3_desc', tag: 'features.f3_tag' },
  { icon: Map,            title: 'features.f4_title', desc: 'features.f4_desc', tag: 'features.f4_tag' },
  { icon: Mic,            title: 'features.f5_title', desc: 'features.f5_desc', tag: 'features.f5_tag' },
];

export default function FeaturesSection() {
  const { t } = useTranslation();
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-ink-900/40" id="features" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-lime-400 block mb-3">{t('features.tag')}</span>
          <h2 id="features-heading" className="font-display text-3xl md:text-4xl text-ink-50">
            {t('features.title')}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {FEATURES.map(({ icon: Icon, title, desc, tag }) => (
            <article
              key={title}
              className="bg-ink-900 border border-ink-700 rounded-2xl p-6 md:p-8 hover:border-lime-400/30 hover:shadow-[0_0_20px_rgba(200,241,53,0.05)] transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center group-hover:bg-lime-400/15 transition-colors">
                  <Icon className="w-5 h-5 text-lime-400" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-500 border border-ink-700 px-2 py-0.5 rounded-full">
                  {t(tag)}
                </span>
              </div>
              <h3 className="font-semibold text-ink-100 mb-2">{t(title)}</h3>
              <p className="text-sm text-ink-400 leading-relaxed">{t(desc)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
