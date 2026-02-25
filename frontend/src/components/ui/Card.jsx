export default function Card({ children, className = '', as: Tag = 'div' }) {
  return (
    <Tag className={`bg-zinc-900 border border-zinc-800 rounded-lg p-4 md:p-5 ${className}`}>
      {children}
    </Tag>
  );
}
