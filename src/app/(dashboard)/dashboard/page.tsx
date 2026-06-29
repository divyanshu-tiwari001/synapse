import { createClient } from '@/lib/supabase/server'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { StreakWidget } from '@/components/dashboard/StreakWidget'
import { WeakTopics } from '@/components/dashboard/WeakTopics'
import Link from 'next/link'
import { MessageSquare, Upload, Trophy, BookOpen } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch subjects
  const { data: subjects } = await supabase.from('subjects').select('*').order('name')

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-xl font-semibold text-white">
          Good to see you{user?.email ? `, ${user.email.split('@')[0]}` : ''}! 👋
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">Here&apos;s your study overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Documents"
          value="—"
          subtitle="Uploaded PDFs"
          icon={<BookOpen className="w-4 h-4" />}
        />
        <StatsCard
          title="Chat Sessions"
          value="—"
          subtitle="AI conversations"
          icon={<MessageSquare className="w-4 h-4" />}
        />
        <StatsCard
          title="Quizzes"
          value="—"
          subtitle="Completed"
          icon={<Trophy className="w-4 h-4" />}
        />
        <StatsCard
          title="Avg Score"
          value="—"
          subtitle="Quiz accuracy"
          trend="neutral"
          trendValue="Start a quiz"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Subjects */}
        <div className="lg:col-span-2 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Subjects</h3>
          {subjects && subjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subjects.map((s: { id: string; name: string; exam_type: string; color?: string }) => (
                <Link
                  key={s.id}
                  href={`/chat/${s.id}`}
                  className="flex items-center gap-3 rounded-lg p-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: s.color || '#4f46e5' }}
                  >
                    {s.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.exam_type}</p>
                  </div>
                  <MessageSquare className="w-4 h-4 text-gray-500 group-hover:text-blue-400 ml-auto transition-colors" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
              <BookOpen className="w-10 h-10 text-gray-500" />
              <p className="text-sm text-gray-400">No subjects yet</p>
              <p className="text-xs text-gray-500">Add subjects from the database or upload your first document</p>
            </div>
          )}
        </div>

        {/* Streak + Weak Topics */}
        <div className="space-y-4">
          <StreakWidget streak={0} />
          <WeakTopics topics={[]} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: '/chat', icon: <MessageSquare className="w-5 h-5" />, label: 'Start chatting', desc: 'Ask the AI tutor', color: 'from-blue-600/20 to-blue-800/20 border-blue-500/20 hover:border-blue-500/40' },
          { href: '/upload', icon: <Upload className="w-5 h-5" />, label: 'Upload a document', desc: 'Add study material', color: 'from-purple-600/20 to-purple-800/20 border-purple-500/20 hover:border-purple-500/40' },
          { href: '/quiz', icon: <Trophy className="w-5 h-5" />, label: 'Take a quiz', desc: 'Test your knowledge', color: 'from-yellow-600/20 to-orange-800/20 border-yellow-500/20 hover:border-yellow-500/40' },
        ].map(a => (
          <Link
            key={a.href}
            href={a.href}
            className={`rounded-xl p-5 bg-gradient-to-br border transition-all duration-200 ${a.color}`}
          >
            <div className="text-white mb-3">{a.icon}</div>
            <p className="text-sm font-semibold text-white">{a.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{a.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
