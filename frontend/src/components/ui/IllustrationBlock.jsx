/* Abstract geometric placeholder — replace with real images later */
export default function IllustrationBlock({ className = '', label = '' }) {
  return (
    <div
      className={`relative rounded-3xl bg-ink-900 border border-ink-700 overflow-hidden flex items-center justify-center ${className}`}
      aria-label={label}
      aria-hidden={!label}
    >
      {/* Abstract grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#c8f135" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Central glow orb */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-lime-400/10 border border-lime-400/30 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-lime-400/30" />
        </div>
        {label && <p className="text-xs text-ink-400 font-medium">{label}</p>}
      </div>

      {/* Corner accent */}
      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-lime-400 opacity-60" />
      <div className="absolute bottom-4 left-4 w-1 h-1 rounded-full bg-lime-400 opacity-40" />
    </div>
  );
}
