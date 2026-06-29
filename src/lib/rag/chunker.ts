export interface TextChunk {
  content: string
  index: number
  startChar: number
  endChar: number
}

export function chunkText(text: string, chunkSize = 1000, overlap = 200): TextChunk[] {
  const chunks: TextChunk[] = []
  let start = 0
  let index = 0
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    const content = text.slice(start, end)
    if (content.trim().length > 50) {
      chunks.push({ content: content.trim(), index, startChar: start, endChar: end })
      index++
    }
    if (end === text.length) break
    start = end - overlap
  }
  return chunks
}
