import Navbar           from '../components/layout/Navbar';
import Footer           from '../components/layout/Footer';
import HeroSection      from '../components/sections/HeroSection';
import MarqueeSection   from '../components/sections/MarqueeSection';
import ProblemSection   from '../components/sections/ProblemSection';
import FeaturesSection  from '../components/sections/FeaturesSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import WhyPathSagaSection from '../components/sections/WhyPathSagaSection';
import FAQSection       from '../components/sections/FAQSection';
import CTASection       from '../components/sections/CTASection';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <MarqueeSection />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <WhyPathSagaSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
