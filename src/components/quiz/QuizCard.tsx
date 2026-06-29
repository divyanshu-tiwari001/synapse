'use client'
import { useState } from 'react'
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { clsx } from 'clsx'
import type { QuizQuestion } from '@/types'

interface Props {
  question: QuizQuestion
  questionNumber: number
  onAnswer: (questionId: string, answer: string) => void
  showResult?: boolean
}

export function QuizCard({ question, questionNumber, onAnswer, showResult = false }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)

  function handleSelect(option: string) {
    if (selected || showResult) return
    setSelected(option)
    onAnswer(question.id, option)
  }

  const isCorrect = selected === question.correct_answer

  return (
    <div className="rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-6 space-y-4">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400">
          {questionNumber}
        </span>
        <p className="text-sm font-medium text-white leading-relaxed">{question.question_text}</p>
      </div>

      {question.question_type === 'mcq' && question.options && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {question.options.map(option => {
            const isSelected = selected === option
            const isRight = option === question.correct_answer
            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={clsx(
                  'rounded-lg px-4 py-2.5 text-sm text-left transition-all duration-200 border',
                  !selected && 'hover:bg-white/10 border-white/10 text-gray-300',
                  isSelected && !showResult && 'bg-blue-600/20 border-blue-500/40 text-white',
                  showResult && isRight && 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300',
                  showResult && isSelected && !isRight && 'bg-red-600/20 border-red-500/40 text-red-300',
                  showResult && !isSelected && !isRight && 'border-white/10 text-gray-500',
                  'cursor-pointer'
                )}
              >
                {option}
              </button>
            )
          })}
        </div>
      )}

      {selected && (
        <div className="flex items-center gap-2 pt-1">
          {isCorrect ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <XCircle className="w-4 h-4 text-red-400" />
          )}
          <span className={clsx('text-xs font-medium', isCorrect ? 'text-emerald-400' : 'text-red-400')}>
            {isCorrect ? 'Correct!' : `Correct answer: ${question.correct_answer}`}
          </span>
        </div>
      )}

      {selected && question.explanation && (
        <div className="border-t border-white/10 pt-3">
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {expanded ? 'Hide' : 'Show'} explanation
          </button>
          {expanded && (
            <p className="mt-2 text-xs text-gray-300 leading-relaxed">{question.explanation}</p>
          )}
        </div>
      )}
    </div>
  )
}
