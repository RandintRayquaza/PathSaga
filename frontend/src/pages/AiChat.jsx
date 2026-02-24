import Navbar from '../components/layout/Navbar';
import ChatInterface from '../components/chat/ChatInterface';
import { useTranslation } from 'react-i18next';

export default function AiChat() {
  const { t } = useTranslation();
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ink-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          <header className="mb-8 text-center md:text-left">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-lime-400 border border-lime-400/30 bg-lime-400/5 px-3 py-1 rounded-full mb-4">
              {t('nav.ai_coach')}
            </span>
            <h1 className="font-display text-3xl md:text-4xl text-ink-50 mb-3">
              {t('chat.title')}
            </h1>
            <p className="text-ink-400 text-sm md:text-base max-w-2xl">
              {t('chat.desc')}
            </p>
          </header>

          <ChatInterface />

        </div>
      </main>
    </>
  );
}
