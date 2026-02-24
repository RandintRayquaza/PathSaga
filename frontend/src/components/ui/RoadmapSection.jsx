import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import { Map } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function RoadmapSection({ roadmap = [] }) {
  const { t } = useTranslation();
  return (
    <Card className="col-span-full lg:col-span-2">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-xl bg-ink-800 border border-ink-600 flex items-center justify-center">
          <Map className="w-4 h-4 text-ink-300" />
        </div>
        <div>
          <p className="text-xs text-ink-500">{t('dashboard.your_plan')}</p>
          <h2 className="font-semibold text-ink-100">{t('dashboard.roadmap_title')}</h2>
        </div>
      </div>

      {roadmap.length === 0 ? (
        <p className="text-sm text-ink-500 text-center py-6">{t('dashboard.no_roadmap')}</p>
      ) : (
        <div className="space-y-6">
          {roadmap.map(({ phase, milestones }) => (
            <div key={phase}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-lime-400/70 mb-3">{t(phase)}</h3>
              <div className="space-y-3 pl-3 border-l border-ink-700">
                {milestones.map(({ label, progress }) => (
                  <div key={label}>
                    <ProgressBar label={t(label)} value={progress} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
