import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Typewriter from '../ui/Typewriter';

export default function HeroSection() {
  const TYPEWRITER_PHRASES = [
    "how to choose.",
    "how to start.",
    "how to build skills.",
    "how to move forward.",
    "how to get hired.",
  ];

  return (
    <section className="min-h-[80vh] flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto w-full animate-fade-in relative z-10">
        
        <h1 className="font-display text-[2.5rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl text-zinc-50 tracking-tight mb-8">
          <span className="block opacity-90">You got your marks.</span>
          <span className="block text-zinc-400 mt-2 sm:mt-4">
            Nobody told you{' '}
            <span className="block sm:inline mt-2 sm:mt-0 text-violet-400">
              <Typewriter phrases={TYPEWRITER_PHRASES} />
            </span>
          </span>
        </h1>
        
        <p className="text-zinc-400 text-base md:text-xl max-w-2xl mb-12 sm:mb-16 leading-relaxed">
          The education system stops at graduation. PathSaga starts there. 
          Map your unique strengths to the right career, get a step-by-step roadmap, 
          and navigate with <span className="text-zinc-300 font-medium">Path AI</span> built for you.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Link 
            to="/signup" 
            className="group relative inline-flex items-center justify-center gap-3 bg-zinc-50 hover:bg-zinc-200 text-zinc-950 px-8 py-4 rounded-full font-semibold transition-all duration-300 w-full sm:w-auto overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start your journey <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

      </div>
      
      {/* Extremely subtle ambient glow behind the hero, performance safe */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-violet-600/10 rounded-full blur-[100px] opacity-50 pointer-events-none" />
    </section>
  );
}
