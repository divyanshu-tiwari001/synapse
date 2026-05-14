import { openai, EMBEDDING_MODEL } from '../openai/client'

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text.replace(/\n/g, ' '),
  })
  return response.data[0].embedding
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts.map(t => t.replace(/\n/g, ' ')),
  })
  return response.data.map(d => d.embedding)
}
