import { createClient } from '@/lib/supabase/server'
import { QuizGenerator } from '@/components/quiz/QuizGenerator'
import { Trophy, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function QuizPage() {
  const supabase = await createClient()
  const { data: subjects } = await supabase.from('subjects').select('*').order('name')
  const { data: sessions } = await supabase
    .from('quiz_sessions')
    .select('*, subjects(name)')
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white">Quiz</h2>
        <p className="text-sm text-gray-400 mt-1">Generate and take adaptive quizzes</p>
      </div>

      {subjects && subjects.length > 0 ? (
        <QuizGenerator subjects={subjects} />
      ) : (
        <div className="rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-8 text-center">
          <p className="text-gray-400">No subjects found. Add subjects to the database first.</p>
        </div>
      )}

      {sessions && sessions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-white mb-4">Recent Quiz Sessions</h3>
          <div className="space-y-3">
            {sessions.map((s: { id: string; topic: string; difficulty: number; score?: number; total_questions?: number; created_at: string; subjects?: { name: string } | null }) => (
              <Link
                key={s.id}
                href={`/quiz/${s.id}`}
                className="flex items-center gap-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{s.topic}</p>
                  <p className="text-xs text-gray-400">
                    {s.subjects?.name} · Difficulty {s.difficulty}/5
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {new Date(s.created_at).toLocaleDateString()}
                </div>
                {s.score != null && s.total_questions != null && (
                  <span className="text-xs font-medium text-blue-400">
                    {s.score}/{s.total_questions}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
