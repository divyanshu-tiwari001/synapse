import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { chunkText } from '@/lib/rag/chunker'
import { generateEmbeddings } from '@/lib/rag/embeddings'
import { FEATURES } from '@/lib/feature-flags'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  if (!FEATURES.UPLOAD) {
    return NextResponse.json({ error: 'Upload feature is disabled' }, { status: 403 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const subjectId = formData.get('subjectId') as string | null
    const title = formData.get('title') as string | null

    if (!file || !subjectId) {
      return NextResponse.json({ error: 'File and subjectId are required' }, { status: 400 })
    }

    const fileId = uuidv4()
    const filePath = `${user.id}/${fileId}/${file.name}`

    // Upload file to Supabase Storage
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(arrayBuffer)

    const { error: storageError } = await supabase.storage
      .from('documents')
      .upload(filePath, fileBuffer, { contentType: file.type })

    if (storageError) {
      return NextResponse.json({ error: 'Storage upload failed', details: storageError.message }, { status: 500 })
    }

    // Create document record
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        subject_id: subjectId,
        title: title || file.name,
        file_path: filePath,
        source_type: 'user',
        status: 'processing',
      })
      .select()
      .single()

    if (docError || !doc) {
      return NextResponse.json({ error: 'Failed to create document record' }, { status: 500 })
    }

    // Extract text from PDF
    let text = ''
    if (file.type === 'application/pdf') {
      const pdfParse = (await import('pdf-parse')).default
      text = (await pdfParse(fileBuffer)).text
    } else {
      text = new TextDecoder().decode(fileBuffer)
    }

    // Chunk and embed
    const chunks = chunkText(text)
    if (chunks.length > 0) {
      const embeddings = await generateEmbeddings(chunks.map(c => c.content))
      const chunkInserts = chunks.map((chunk, i) => ({
        document_id: doc.id,
        content: chunk.content,
        chunk_index: chunk.index,
        embedding: embeddings[i],
      }))

      const { error: chunkError } = await supabase.from('document_chunks').insert(chunkInserts)
      if (chunkError) {
        await supabase.from('documents').update({ status: 'failed' }).eq('id', doc.id)
        return NextResponse.json({ error: 'Failed to store chunks' }, { status: 500 })
      }
    }

    await supabase.from('documents').update({ status: 'ready' }).eq('id', doc.id)

    return NextResponse.json({ document: doc, chunkCount: chunks.length })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
