import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { QuizSession } from '@/components/quiz/QuizSession'

interface Props {
  params: Promise<{ sessionId: string }>
}

export default async function QuizSessionPage({ params }: Props) {
  const { sessionId } = await params
  const supabase = await createClient()

  const { data: session } = await supabase
    .from('quiz_sessions')
    .select('*, subjects(name)')
    .eq('id', sessionId)
    .single()

  if (!session) notFound()

  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at')

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">{session.topic}</h2>
        <p className="text-sm text-gray-400 mt-1">
          {session.subjects?.name} · Difficulty {session.difficulty}/5 · {questions?.length || 0} questions
        </p>
      </div>
      <QuizSession sessionId={sessionId} questions={questions || []} />
    </div>
  )
}
