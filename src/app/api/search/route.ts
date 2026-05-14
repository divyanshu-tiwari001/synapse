import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { retrieveRelevantChunks } from '@/lib/rag/retrieval'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { query, subjectId, limit = 5 } = await request.json()

  try {
    const chunks = await retrieveRelevantChunks(query, subjectId, user.id, limit)
    return NextResponse.json({ results: chunks })
  } catch {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
