import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { openai, CHAT_MODEL } from '@/lib/openai/client'
import { FEATURES } from '@/lib/feature-flags'

export async function POST(request: NextRequest) {
  if (!FEATURES.QUIZ) {
    return NextResponse.json({ error: 'Quiz feature is disabled' }, { status: 403 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { subjectId, topic, difficulty, questionCount = 5 } = await request.json()

    if (!subjectId || !topic) {
      return NextResponse.json({ error: 'subjectId and topic are required' }, { status: 400 })
    }

    const difficultyLabel = ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'][difficulty - 1] || 'Medium'

    const prompt = `Generate ${questionCount} quiz questions about "${topic}" at ${difficultyLabel} difficulty level for Indian competitive exams (JEE/NEET/CBSE).

Return ONLY a valid JSON array with this exact structure (no markdown, no extra text):
[
  {
    "question_text": "Question here",
    "question_type": "mcq",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": "Option A",
    "explanation": "Explanation here"
  }
]

Mix MCQ and short_answer types. For short_answer questions, omit the options field.`

    const completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    })

    const raw = completion.choices[0]?.message?.content || '[]'
    let questions: Array<{
      question_text: string
      question_type: 'mcq' | 'short_answer'
      options?: string[]
      correct_answer: string
      explanation: string
    }>

    try {
      questions = JSON.parse(raw)
    } catch {
      const match = raw.match(/\[[\s\S]*\]/)
      questions = match ? JSON.parse(match[0]) : []
    }

    // Create quiz session
    const { data: session, error: sessionError } = await supabase
      .from('quiz_sessions')
      .insert({
        user_id: user.id,
        subject_id: subjectId,
        topic,
        difficulty,
      })
      .select()
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Failed to create quiz session' }, { status: 500 })
    }

    // Insert questions
    const questionInserts = questions.map(q => ({
      session_id: session.id,
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.options || null,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
    }))

    const { data: insertedQuestions, error: questionsError } = await supabase
      .from('quiz_questions')
      .insert(questionInserts)
      .select()

    if (questionsError) {
      return NextResponse.json({ error: 'Failed to store questions' }, { status: 500 })
    }

    return NextResponse.json({ session, questions: insertedQuestions })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Quiz generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
