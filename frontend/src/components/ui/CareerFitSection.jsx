import Card from '../ui/Card';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';
import { Target, Link2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function CareerFitSection({ data }) {
  const { t } = useTranslation();
  if (!data) {
    return (
      <Card className="flex flex-col items-center justify-center text-center py-10 gap-3">
        <Target className="w-8 h-8 text-ink-600" />
        <p className="font-medium text-ink-300">{t('dashboard.no_match')}</p>
        <p className="text-sm text-ink-500">{t('dashboard.no_match_desc')}</p>
        <Link to="/assessment" className="mt-1">
          <button className="text-sm text-lime-400 border border-lime-400/30 px-4 py-1.5 rounded-full hover:bg-lime-400/10 transition-colors">
            {t('dashboard.btn_take_assessment')}
          </button>
        </Link>
      </Card>
    );
  }

  const { title, score, description, topSkills } = data;

  return (
    <Card glow>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center">
            <Target className="w-4 h-4 text-lime-400" />
          </div>
          <div>
            <p className="text-xs text-ink-500">{t('dashboard.match_top')}</p>
            <h2 className="font-semibold text-ink-100">{t(title)}</h2>
          </div>
        </div>
        <Badge color="lime">{t('dashboard.ai_match')}</Badge>
      </div>

      <ProgressBar value={score} max={100} label={t('dashboard.fit_score')} />

      <p className="mt-4 text-sm text-ink-400 leading-relaxed">{t(description)}</p>

      {topSkills?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {topSkills.map((s) => <Badge key={s} color="gray">{s}</Badge>)}
        </div>
      )}
    </Card>
  );
}
