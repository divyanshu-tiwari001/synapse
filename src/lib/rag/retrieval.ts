import { createClient } from '../supabase/server'
import { generateEmbedding } from './embeddings'

export interface RetrievedChunk {
  id: string
  content: string
  similarity: number
  document_id: string
  document_title: string
}

export async function retrieveRelevantChunks(
  query: string,
  subjectId: string,
  userId: string,
  limit = 5
): Promise<RetrievedChunk[]> {
  const supabase = await createClient()
  const embedding = await generateEmbedding(query)

  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: embedding,
    match_threshold: 0.7,
    match_count: limit,
    filter_subject_id: subjectId,
    filter_user_id: userId,
  })

  if (error) throw error
  return data || []
}
