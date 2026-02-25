export default function PageLoader() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center" role="status">
      <div className="flex flex-col items-center gap-3">
        <span className="w-5 h-5 rounded-full border-2 border-zinc-700 border-t-violet-400 animate-spin" />
        <span className="text-xs text-zinc-500 tracking-widest uppercase">Loading</span>
      </div>
    </div>
  );
}
