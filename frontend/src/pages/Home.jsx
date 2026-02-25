import Navbar             from '../components/layout/Navbar';
import Footer             from '../components/layout/Footer';
import HeroSection        from '../components/sections/HeroSection';
import ProcessSection     from '../components/sections/ProcessSection';
import WhyPathSagaSection from '../components/sections/WhyPathSagaSection';
import PathAiSection      from '../components/sections/PathAiSection';
import WhoItsForSection   from '../components/sections/WhoItsForSection';
import CTASection         from '../components/sections/CTASection';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-zinc-950 text-zinc-100 selection:bg-violet-500/30">
        <HeroSection />
        <WhyPathSagaSection />
        <ProcessSection />
        <PathAiSection />
        <WhoItsForSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
