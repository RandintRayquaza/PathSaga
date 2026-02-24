import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FAQS = [
  { q: 'faq.q1', a: 'faq.a1' },
  { q: 'faq.q2', a: 'faq.a2' },
  { q: 'faq.q3', a: 'faq.a3' },
  { q: 'faq.q4', a: 'faq.a4' },
  { q: 'faq.q5', a: 'faq.a5' },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <div className="border-b border-ink-800 last:border-0">
      <button
        className="w-full flex items-center justify-between py-4 md:py-6 text-left gap-4 group"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-ink-200 group-hover:text-lime-400 transition-colors">{t(q)}</span>
        <ChevronDown className={`w-4 h-4 text-ink-500 flex-none transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="pb-4 md:pb-6 text-sm text-ink-400 leading-relaxed">{t(a)}</p>}
    </div>
  );
}

export default function FAQSection() {
  const { t } = useTranslation();
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-ink-900/40" aria-labelledby="faq-heading">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-lime-400 block mb-3">{t('faq.tag')}</span>
            <h2 id="faq-heading" className="font-display text-3xl md:text-4xl text-ink-50">{t('faq.title')}</h2>
          </div>
          <div className="bg-ink-900 border border-ink-700 rounded-2xl px-6 md:px-8">
            {FAQS.map(({ q, a }) => <FAQItem key={q} q={q} a={a} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
