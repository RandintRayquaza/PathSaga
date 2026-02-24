import { useDispatch } from 'react-redux';
import { toggleTask } from '../../redux/slices/userSlice';
import Card from '../ui/Card';
import { CheckSquare, Square, ClipboardList } from 'lucide-react';

export default function TasksSection({ tasks = [] }) {
  const dispatch = useDispatch();
  const done = tasks.filter((t) => t.done).length;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-ink-800 border border-ink-600 flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-ink-300" />
          </div>
          <div>
            <p className="text-xs text-ink-500">Recommended</p>
            <h2 className="font-semibold text-ink-100">Actions</h2>
          </div>
        </div>
        {tasks.length > 0 && (
          <span className="text-xs text-ink-500">{done}/{tasks.length}</span>
        )}
      </div>

      {tasks.length === 0 ? (
        <p className="text-sm text-ink-500 text-center py-6">Tasks will appear based on your roadmap.</p>
      ) : (
        <ul className="space-y-1">
          {tasks.map(({ id, label, done }) => (
            <li key={id}>
              <button
                onClick={() => dispatch(toggleTask(id))}
                className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-ink-800 transition-colors text-left group"
                aria-label={`${done ? 'Uncheck' : 'Check'}: ${label}`}
              >
                {done
                  ? <CheckSquare className="w-4 h-4 text-lime-400 flex-none mt-0.5" />
                  : <Square      className="w-4 h-4 text-ink-600 flex-none mt-0.5 group-hover:text-ink-400 transition-colors" />
                }
                <span className={`text-sm leading-snug ${done ? 'text-ink-600 line-through' : 'text-ink-300'}`}>
                  {label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
