const colors = {
  lime:   'bg-violet-400/10 text-violet-400 border-violet-400/20',
  red:    'bg-red-500/10 text-red-400 border-red-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  gray:   'bg-zinc-700 text-zinc-300 border-zinc-600',
  violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
};

export default function Badge({ children, color = 'gray' }) {
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border ${colors[color]}`}>
      {children}
    </span>
  );
}
