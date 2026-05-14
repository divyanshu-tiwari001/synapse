'use client'
import { Trophy, RotateCcw, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Props {
  score: number
  total: number
  onRetry: () => void
  onBack: () => void
}

export function QuizResults({ score, total, onRetry, onBack }: Props) {
  const percentage = Math.round((score / total) * 100)
  const grade = percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good job!' : 'Keep practicing!'

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-12 text-center">
      <div className="relative">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 flex items-center justify-center">
          <Trophy className="w-16 h-16 text-yellow-400" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
          {percentage}%
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white">{grade}</h2>
        <p className="text-gray-400 mt-1">
          You got{' '}
          <span className="text-white font-semibold">{score}</span> out of{' '}
          <span className="text-white font-semibold">{total}</span> correct
        </p>
      </div>

      <div className="flex gap-3">
        <div className="flex items-center gap-2 rounded-lg px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-emerald-400 font-medium">{score} correct</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg px-4 py-2.5 bg-red-500/10 border border-red-500/20">
          <XCircle className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-400 font-medium">{total - score} incorrect</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack}>Back to Quiz</Button>
        <Button onClick={onRetry}>
          <RotateCcw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    </div>
  )
}
