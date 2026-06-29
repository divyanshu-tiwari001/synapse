import { AlertTriangle } from 'lucide-react'
import { clsx } from 'clsx'

interface WeakTopic {
  topic: string
  score: number
}

interface Props {
  topics: WeakTopic[]
}

export function WeakTopics({ topics }: Props) {
  return (
    <div className="rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-yellow-400" />
        <p className="text-sm text-gray-400">Areas to Improve</p>
      </div>
      {topics.length === 0 ? (
        <p className="text-xs text-gray-500">No weak topics identified yet. Keep practicing!</p>
      ) : (
        <div className="space-y-3">
          {topics.map(t => (
            <div key={t.topic}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-white">{t.topic}</span>
                <span className="text-xs text-gray-400">{t.score}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={clsx(
                    'h-full rounded-full transition-all duration-500',
                    t.score < 40 ? 'bg-red-500' : t.score < 70 ? 'bg-yellow-500' : 'bg-emerald-500'
                  )}
                  style={{ width: `${t.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
