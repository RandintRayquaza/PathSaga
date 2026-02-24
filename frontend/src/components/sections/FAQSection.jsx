import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  { q: 'Is PathSaga free?',                        a: 'The core assessment, career matching, and roadmap are completely free to use.' },
  { q: 'Who is PathSaga for?',                     a: 'School students, college students, and early-career professionals who want clarity on their career direction.' },
  { q: 'How does the career matching work?',       a: 'Our AI analyses your assessment answers across multiple dimensions — interests, values, working style — and surfaces careers that align with your profile.' },
  { q: 'Can I retake the assessment?',             a: 'Yes. You can retake anytime, and your roadmap will update based on your new answers.' },
  { q: 'Is my data private?',                      a: 'Your data is stored securely and never shared with or sold to third parties.' },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ink-800 last:border-0">
      <button
        className="w-full flex items-center justify-between py-4 text-left gap-4"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-ink-200">{q}</span>
        <ChevronDown className={`w-4 h-4 text-ink-500 flex-none transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="pb-4 text-sm text-ink-400 leading-relaxed">{a}</p>}
    </div>
  );
}

export default function FAQSection() {
  return (
    <section className="py-20 px-4 bg-ink-900/40" aria-labelledby="faq-heading">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-lime-400 block mb-3">FAQ</span>
          <h2 id="faq-heading" className="font-display text-3xl text-ink-50">Common Questions</h2>
        </div>
        <div className="bg-ink-900 border border-ink-700 rounded-2xl px-6">
          {FAQS.map(({ q, a }) => <FAQItem key={q} q={q} a={a} />)}
        </div>
      </div>
    </section>
  );
}
