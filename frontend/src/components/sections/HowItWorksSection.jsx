import { useTranslation } from 'react-i18next';

const STEPS = [
  { num: '01', title: 'how_it_works.s1_title', desc: 'how_it_works.s1_desc' },
  { num: '02', title: 'how_it_works.s2_title', desc: 'how_it_works.s2_desc' },
  { num: '03', title: 'how_it_works.s3_title', desc: 'how_it_works.s3_desc' },
  { num: '04', title: 'how_it_works.s4_title', desc: 'how_it_works.s4_desc' },
];

export default function HowItWorksSection() {
  const { t } = useTranslation();
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8" id="how-it-works" aria-labelledby="hiw-heading">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-lime-400 block mb-3">{t('how_it_works.tag')}</span>
          <h2 id="hiw-heading" className="font-display text-3xl md:text-4xl text-ink-50">
            {t('how_it_works.title')}
          </h2>
          <p className="mt-3 text-ink-400 max-w-md mx-auto text-sm">
            {t('how_it_works.subtitle')}
          </p>
        </div>

        {/* Step grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {STEPS.map(({ num, title, desc }, i) => (
            <div key={num} className="relative">
              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(100%+12px)] xl:left-[calc(100%+16px)] w-6 h-px bg-ink-700" aria-hidden="true" />
              )}

              <div className="bg-ink-900 border border-ink-700 rounded-2xl p-6 md:p-8 h-full hover:border-lime-400/20 transition-colors">
                <span className="font-display text-4xl text-lime-400/20 block mb-4">{num}</span>
                <h3 className="font-semibold text-ink-100 mb-2">{t(title)}</h3>
                <p className="text-sm text-ink-400 leading-relaxed">{t(desc)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
