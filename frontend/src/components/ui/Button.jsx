const base =
  'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 ' +
  'disabled:opacity-40 disabled:pointer-events-none cursor-pointer ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400';

const variants = {
  primary:   'bg-violet-500 hover:bg-violet-400 text-white font-semibold',
  secondary: 'bg-zinc-800 border border-zinc-700 text-zinc-200 hover:border-zinc-500 hover:text-zinc-50',
  ghost:     'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70',
  danger:    'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/15',
  outline:   'border border-violet-500/40 text-violet-300 hover:bg-violet-500/8 hover:border-violet-400',
};

const sizes = {
  sm: 'text-xs px-3.5 py-1.5 rounded-md min-h-[34px]',
  md: 'text-sm px-4 py-2 rounded-lg min-h-[42px]',
  lg: 'text-sm px-6 py-3 rounded-lg min-h-[48px] tracking-wide',
};

export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
