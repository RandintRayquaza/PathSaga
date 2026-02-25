import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSelector } from 'react-redux';
export default function CTASection() {
  const isAuth = useSelector((s) => s.auth.isAuthenticated);

  return (
    <section className="py-32 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <h2 className="font-display text-h2 text-zinc-50 leading-[1.1] mb-2 tracking-tight">
            Start your path.<br />
            It takes 4 minutes.
          </h2>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          {isAuth ? (
            <Link 
              to="/dashboard" 
              className="inline-flex items-center justify-center gap-2 bg-violet-500 hover:bg-violet-400 text-white px-8 py-3.5 rounded-full font-semibold transition-colors w-full sm:w-auto"
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link 
                to="/signup" 
                className="inline-flex items-center justify-center gap-2 bg-violet-500 hover:bg-violet-400 text-white px-8 py-3.5 rounded-full font-semibold transition-colors w-full sm:w-auto"
              >
                Create free account <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-sm text-zinc-500">
                Already have one? <Link to="/login" className="text-zinc-300 hover:text-zinc-50 transition-colors">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
