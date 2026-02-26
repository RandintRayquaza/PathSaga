import ChatInterface from '../components/chat/ChatInterface';
import { useTranslation } from 'react-i18next';

export default function AiChat() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-[100dvh] lg:h-screen w-full">
      <header className="flex-none px-6 py-4 flex items-center justify-between border-b border-zinc-900 bg-zinc-950 z-10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          <h1 className="font-display text-base font-medium text-zinc-100 tracking-wide">{t("aichat.coach", "PathSaga Coach")}</h1>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-zinc-500 border border-zinc-800 px-2 py-1 rounded">
          {t("aichat.online", "Online")}
        </div>
      </header>
      
      <main className="flex-1 bg-zinc-950 overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
}
