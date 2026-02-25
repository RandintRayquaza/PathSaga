export default function StepIndicator({ current, total, className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} aria-label={`Step ${current + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all duration-300 ${
            i < current   ? 'w-5 bg-violet-400'  :
            i === current ? 'w-8 bg-violet-400'  :
                            'w-5 bg-zinc-700'
          }`}
        />
      ))}
    </div>
  );
}
