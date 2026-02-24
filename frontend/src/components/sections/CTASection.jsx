import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export default function CTASection() {
  return (
    <section className="py-20 px-4" aria-labelledby="cta-heading">
      <div className="max-w-3xl mx-auto text-center">
        {/* Glow ring */}
        <div className="inline-block mb-6 p-px bg-gradient-to-b from-lime-400/30 to-transparent rounded-full">
          <span className="block text-xs font-semibold uppercase tracking-widest text-lime-400 bg-ink-950 px-4 py-1 rounded-full">
            Get Started Today
          </span>
        </div>

        <h2 id="cta-heading" className="font-display text-4xl md:text-5xl text-ink-50 mb-5">
          Ready to find<br />your path?
        </h2>
        <p className="text-ink-400 mb-8 max-w-md mx-auto">
          Start your free assessment — no credit card, no commitment.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/signup">
            <Button size="lg">
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg">Log In</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
