export default function Card({ children, className = '', glow = false }) {
  return (
    <div className={`
      bg-ink-900 border border-ink-700 rounded-2xl p-5
      ${glow ? 'shadow-[0_0_24px_rgba(200,241,53,0.06)]' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}
