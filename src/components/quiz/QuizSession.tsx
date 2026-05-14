'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QuizCard } from '@/components/quiz/QuizCard'
import { QuizResults } from '@/components/quiz/QuizResults'
import type { QuizQuestion } from '@/types'
import { Button } from '@/components/ui/Button'

interface Props {
  sessionId: string
  questions: QuizQuestion[]
}

export function QuizSession({ sessionId, questions }: Props) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  function handleAnswer(questionId: string, answer: string) {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const allAnswered = questions.every(q => answers[q.id])
  const score = submitted
    ? questions.filter(q => answers[q.id] === q.correct_answer).length
    : 0

  if (submitted) {
    return (
      <QuizResults
        score={score}
        total={questions.length}
        onRetry={() => router.push('/quiz')}
        onBack={() => router.push('/quiz')}
      />
    )
  }

  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <QuizCard
          key={q.id}
          question={q}
          questionNumber={i + 1}
          onAnswer={handleAnswer}
        />
      ))}
      <div className="flex justify-end pt-4">
        <Button
          onClick={() => setSubmitted(true)}
          disabled={!allAnswered}
          size="lg"
        >
          Submit Quiz ({Object.keys(answers).length}/{questions.length} answered)
        </Button>
      </div>
    </div>
  )
}
