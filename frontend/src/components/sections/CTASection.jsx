import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';

export default function CTASection() {
  const { t } = useTranslation();
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8" aria-labelledby="cta-heading">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center bg-ink-900/80 border border-ink-800 rounded-[2.5rem] p-8 md:p-16 lg:p-20 relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-lime-400/5 blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />
          
          <div className="relative z-10">
            {/* Glow ring */}
            <div className="inline-block mb-6 p-px bg-linear-to-b from-lime-400/30 to-transparent rounded-full">
              <span className="block text-xs font-semibold uppercase tracking-widest text-lime-400 bg-ink-950 px-4 py-1 rounded-full">
                {t('cta.tag')}
              </span>
            </div>

            <h2 id="cta-heading" className="font-display text-4xl md:text-5xl lg:text-6xl text-ink-50 mb-6">
              {t('cta.title_1')}<br />{t('cta.title_2')}
            </h2>
            <p className="text-ink-400 mb-10 max-w-md mx-auto text-lg">
              {t('cta.desc')}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  {t('cta.btn_create')} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">{t('cta.btn_login')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
