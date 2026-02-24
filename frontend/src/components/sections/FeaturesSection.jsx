import { ClipboardCheck, Zap, TrendingUp, Map, Mic } from 'lucide-react';

const FEATURES = [
  { icon: ClipboardCheck, title: 'Career Assessment',   desc: 'A structured quiz that maps your strengths, values, and personality to real career categories.',           tag: 'Foundation' },
  { icon: Zap,            title: 'AI Career Match',     desc: 'Intelligent analysis surfaces the careers with the highest alignment to your unique profile.',              tag: 'AI-Powered' },
  { icon: TrendingUp,     title: 'Skill Gap Detection', desc: 'Pinpoints exactly which skills you need to develop and prioritises them by impact.',                        tag: 'Analytics'  },
  { icon: Map,            title: '3-Phase Roadmap',     desc: 'Phase 1: Foundation. Phase 2: Build. Phase 3: Launch. A clear, staged plan tailored to your starting point.', tag: 'Action'     },
  { icon: Mic,            title: 'Voice Assistant',     desc: 'Ask questions, get guidance, and receive coaching through a natural conversational interface.',               tag: 'Coming Soon' },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-ink-900/40" id="features" aria-labelledby="features-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-lime-400 block mb-3">Features</span>
          <h2 id="features-heading" className="font-display text-3xl md:text-4xl text-ink-50">
            Everything you need to move forward
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc, tag }) => (
            <article
              key={title}
              className="bg-ink-900 border border-ink-700 rounded-2xl p-5 hover:border-lime-400/30 hover:shadow-[0_0_20px_rgba(200,241,53,0.05)] transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center group-hover:bg-lime-400/15 transition-colors">
                  <Icon className="w-5 h-5 text-lime-400" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-500 border border-ink-700 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              </div>
              <h3 className="font-semibold text-ink-100 mb-2">{title}</h3>
              <p className="text-sm text-ink-400 leading-relaxed">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
