import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { TrendingUp } from 'lucide-react';

const PRIORITY_COLOR = { High: 'red', Medium: 'yellow', Low: 'gray' };

export default function SkillGapSection({ gaps = [] }) {
  return (
    <Card>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl bg-ink-800 border border-ink-600 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-ink-300" />
        </div>
        <div>
          <p className="text-xs text-ink-500">Gaps to Close</p>
          <h2 className="font-semibold text-ink-100">Skill Gaps</h2>
        </div>
      </div>

      {gaps.length === 0 ? (
        <p className="text-sm text-ink-500 text-center py-6">No skill gaps identified yet. Complete your assessment first.</p>
      ) : (
        <ul className="divide-y divide-ink-800">
          {gaps.map(({ skill, level, priority }) => (
            <li key={skill} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-ink-200">{skill}</p>
                <p className="text-xs text-ink-500 mt-0.5">{level}</p>
              </div>
              <Badge color={PRIORITY_COLOR[priority] || 'gray'}>{priority}</Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
