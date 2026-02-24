import { Zap, Brain, TrendingUp, Map, Mic } from 'lucide-react';

const ITEMS = [
  { icon: Zap,         label: 'Career Assessment'   },
  { icon: Brain,       label: 'AI Career Match'      },
  { icon: TrendingUp,  label: 'Skill Gap Detection'  },
  { icon: Map,         label: '3-Phase Roadmap'      },
  { icon: Mic,         label: 'Voice Assistant'       },
  { icon: Zap,         label: 'Career Assessment'   },
  { icon: Brain,       label: 'AI Career Match'      },
  { icon: TrendingUp,  label: 'Skill Gap Detection'  },
  { icon: Map,         label: '3-Phase Roadmap'      },
  { icon: Mic,         label: 'Voice Assistant'       },
];

export default function MarqueeSection() {
  return (
    <section className="py-5 border-y border-ink-800 bg-ink-900/50 overflow-hidden" aria-label="Key features">
      {/* Fade masks */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-ink-950 to-transparent z-10 pointer-events-none" aria-hidden="true" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-ink-950 to-transparent z-10 pointer-events-none" aria-hidden="true" />

        {/* Track — duplicated for seamless loop */}
        <div className="marquee-track gap-8 px-4" aria-hidden="true">
          {[...ITEMS, ...ITEMS].map(({ icon: Icon, label }, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 flex-none text-ink-300 px-4"
            >
              <Icon className="w-4 h-4 text-lime-400 flex-none" />
              <span className="text-sm font-medium whitespace-nowrap">{label}</span>
              <span className="ml-4 text-ink-700">·</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
