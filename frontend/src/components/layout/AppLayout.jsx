import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-[100dvh] bg-zinc-950">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:pl-[240px] w-full max-w-full">
        <main className="flex-1 flex flex-col pb-16 lg:pb-0 min-h-0 container-type-size">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
