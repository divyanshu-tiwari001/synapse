import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'

export default async function ChatIndexPage() {
  const supabase = await createClient()
  const { data: subjects } = await supabase.from('subjects').select('*').order('name')

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">AI Chat</h2>
        <p className="text-sm text-gray-400 mt-1">Select a subject to start chatting</p>
      </div>

      {subjects && subjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((s: { id: string; name: string; exam_type: string; color?: string; description?: string }) => (
            <Link
              key={s.id}
              href={`/chat/${s.id}`}
              className="rounded-xl p-5 backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-lg"
                  style={{ background: s.color || '#4f46e5' }}
                >
                  {s.name[0]}
                </div>
                <MessageSquare className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
              </div>
              <p className="font-semibold text-white">{s.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.exam_type}</p>
              {s.description && (
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{s.description}</p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <MessageSquare className="w-12 h-12 text-gray-500" />
          <p className="text-gray-400">No subjects available yet</p>
          <p className="text-sm text-gray-500">Subjects are managed in the database</p>
        </div>
      )}
    </div>
  )
}
