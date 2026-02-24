export default function FormField({ label, id, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-ink-300 mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full bg-ink-800 border rounded-xl px-4 py-3 text-ink-100 text-sm placeholder:text-ink-500
          outline-none transition-all duration-200
          ${error ? 'border-red-500 focus:border-red-400' : 'border-ink-600 focus:border-lime-400 focus:shadow-[0_0_0_3px_rgba(200,241,53,0.1)]'}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
