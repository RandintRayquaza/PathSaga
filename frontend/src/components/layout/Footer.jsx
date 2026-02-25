import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 py-12 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="text-center sm:text-left">
          <Link to="/" className="font-display text-lg font-bold text-zinc-50 tracking-tight">
            Path<span className="text-violet-500">Saga</span>
          </Link>
          <p className="text-xs text-zinc-500 mt-2">© 2026 PathSaga Platform.</p>
        </div>
        
        <div className="flex gap-6 text-sm">
          <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors">Privacy</a>
          <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors">Terms</a>
          <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
