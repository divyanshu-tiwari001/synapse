import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ChatInterface } from '@/components/chat/ChatInterface'

interface Props {
  params: Promise<{ subjectId: string }>
}

export default async function ChatSubjectPage({ params }: Props) {
  const { subjectId } = await params
  const supabase = await createClient()

  const { data: subject } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', subjectId)
    .single()

  if (!subject) notFound()

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-3 border-b border-white/10 flex items-center gap-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
          style={{ background: subject.color || '#4f46e5' }}
        >
          {subject.name[0]}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{subject.name}</p>
          <p className="text-xs text-gray-400">{subject.exam_type}</p>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatInterface subject={subject} />
      </div>
    </div>
  )
}
