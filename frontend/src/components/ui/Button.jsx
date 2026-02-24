const variants = {
  primary:   'bg-lime-400 text-ink-950 hover:bg-lime-300 font-semibold',
  secondary: 'border border-ink-600 text-ink-200 hover:border-lime-400 hover:text-lime-400',
  ghost:     'text-ink-300 hover:text-lime-400',
  dark:      'bg-ink-800 text-ink-100 hover:bg-ink-700',
};

export default function Button({ children, variant = 'primary', className = '', size = 'md', ...props }) {
  const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-2.5 text-sm', lg: 'px-8 py-3.5 text-base' };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-lime-400 disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
