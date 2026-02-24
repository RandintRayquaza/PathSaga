import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import IllustrationBlock from '../ui/IllustrationBlock';
import Button from '../ui/Button';

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden" aria-labelledby="hero-heading">

      {/* Background glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-lime-400/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Left: text */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-lime-400 border border-lime-400/30 bg-lime-400/5 px-3 py-1 rounded-full mb-6">
            {t('landing.hero_tag', 'AI Career Guidance')}
          </span>

          <h1 id="hero-heading" className="font-display text-4xl md:text-5xl lg:text-6xl text-ink-50 leading-tight mb-5">
            {t('landing.hero_title_1', 'Find Your Path.')}<br />
            <span className="text-lime-400">{t('landing.hero_title_2', 'Own Your Future.')}</span>
          </h1>

          <p className="text-ink-300 text-lg leading-relaxed mb-8 max-w-md">
            {t('landing.hero_desc', 'PathSaga uses AI to match your unique strengths and interests to the right career — then builds a step-by-step roadmap to get you there.')}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to="/signup">
              <Button size="lg">
                {t('landing.btn_start', 'Start Free')} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/#how-it-works">
              <Button variant="secondary" size="lg">{t('landing.btn_how_it_works', 'See How It Works')}</Button>
            </Link>
          </div>
        </motion.div>

        {/* Right: illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <IllustrationBlock className="w-full h-80 md:h-[500px]" label="Career journey illustration" />
        </motion.div>
      </div>
    </section>
  );
}
