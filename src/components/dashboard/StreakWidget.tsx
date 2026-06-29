import { Flame } from 'lucide-react'
import { clsx } from 'clsx'

interface Props {
  streak: number
}

export function StreakWidget({ streak }: Props) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const today = new Date().getDay()
  // Sunday=0 in JS, remap to M=0
  const todayIdx = (today + 6) % 7

  return (
    <div className="rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">Study Streak</p>
        <Flame className="w-5 h-5 text-orange-400" />
      </div>
      <div className="flex items-end gap-1">
        <span className="text-3xl font-bold text-white">{streak}</span>
        <span className="text-gray-400 mb-1 text-sm">days</span>
      </div>
      <div className="flex gap-1">
        {days.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={clsx(
                'w-full aspect-square rounded-md transition-colors',
                i <= todayIdx && streak > todayIdx - i
                  ? 'bg-gradient-to-b from-orange-500 to-red-500'
                  : 'bg-white/5 border border-white/10'
              )}
            />
            <span className="text-[10px] text-gray-500">{d}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
