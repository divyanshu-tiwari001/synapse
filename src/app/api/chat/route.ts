import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { openai, CHAT_MODEL } from '@/lib/openai/client'
import { retrieveRelevantChunks, RetrievedChunk } from '@/lib/rag/retrieval'
import { FEATURES } from '@/lib/feature-flags'

export async function POST(request: NextRequest) {
  if (!FEATURES.CHAT) {
    return new Response(JSON.stringify({ error: 'Chat feature is disabled' }), { status: 403 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const body = await request.json()
  const { message, sessionId, subjectId } = body

  await supabase.from('chat_messages').insert({
    session_id: sessionId,
    role: 'user',
    content: message,
  })

  let context = ''
  let sources: RetrievedChunk[] = []
  if (FEATURES.UPLOAD) {
    try {
      sources = await retrieveRelevantChunks(message, subjectId, user.id)
      if (sources.length > 0) {
        context = sources.map(s => s.content).join('\n\n---\n\n')
      }
    } catch {
      // Continue without RAG context
    }
  }

  const systemPrompt = context
    ? `You are an expert study assistant for competitive exams (JEE, NEET, CBSE). Answer based on the provided context when relevant. Use markdown formatting. For math, use LaTeX (wrap in $...$ or $$...$$).

Context from uploaded materials:
${context}`
    : `You are an expert study assistant for competitive exams (JEE, NEET, CBSE). Answer questions clearly and concisely. Use markdown formatting. For math, use LaTeX (wrap in $...$ or $$...$$).`

  const stream = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ],
    stream: true,
  })

  let fullText = ''
  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || ''
        fullText += text
        controller.enqueue(encoder.encode(text))
      }
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        role: 'assistant',
        content: fullText,
        sources:
          sources.length > 0
            ? sources.map(s => ({ id: s.id, title: s.document_title, similarity: s.similarity }))
            : null,
      })
      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  })
}
