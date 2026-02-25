export default function FormField({ id, label, error, type = 'text', className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`w-full bg-zinc-800 border text-zinc-100 placeholder-zinc-500 text-sm px-3.5 py-3 rounded-lg min-h-[46px] outline-none transition-colors duration-150
          ${error
            ? 'border-red-400/60 focus:border-red-400'
            : 'border-zinc-700 focus:border-violet-400/50 focus:bg-zinc-800'
          }`}
        {...props}
      />
      {error && <p className="text-[11px] text-red-400 mt-0.5 flex items-center gap-1">⚠ {error}</p>}
    </div>
  );
}
