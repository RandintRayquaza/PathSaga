import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import { Map } from 'lucide-react';

export default function RoadmapSection({ roadmap = [] }) {
  return (
    <Card className="col-span-full lg:col-span-2">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-xl bg-ink-800 border border-ink-600 flex items-center justify-center">
          <Map className="w-4 h-4 text-ink-300" />
        </div>
        <div>
          <p className="text-xs text-ink-500">Your Plan</p>
          <h2 className="font-semibold text-ink-100">3-Phase Roadmap</h2>
        </div>
      </div>

      {roadmap.length === 0 ? (
        <p className="text-sm text-ink-500 text-center py-6">Your roadmap will appear here after assessment.</p>
      ) : (
        <div className="space-y-6">
          {roadmap.map(({ phase, milestones }) => (
            <div key={phase}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-lime-400/70 mb-3">{phase}</h3>
              <div className="space-y-3 pl-3 border-l border-ink-700">
                {milestones.map(({ label, progress }) => (
                  <div key={label}>
                    <ProgressBar label={label} value={progress} />
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
