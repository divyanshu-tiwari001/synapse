export interface User {
  id: string
  email: string
  created_at: string
}

export interface Subject {
  id: string
  name: string
  description?: string
  created_at: string
}

export interface Document {
  id: string
  user_id: string
  subject_id: string
  title: string
  file_path: string
  source_type: 'user' | 'admin'
  status: 'pending' | 'processing' | 'ready' | 'failed'
  created_at: string
}

export interface DocumentChunk {
  id: string
  document_id: string
  content: string
  chunk_index: number
  embedding?: number[]
  created_at: string
}

export interface ChatSession {
  id: string
  user_id: string
  subject_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  sources?: MessageSource[]
  created_at: string
}

export interface MessageSource {
  id: string
  title: string
  similarity: number
}

export interface QuizSession {
  id: string
  user_id: string
  subject_id: string
  topic: string
  difficulty: 1 | 2 | 3 | 4 | 5
  score?: number
  completed_at?: string
  created_at: string
}

export interface QuizQuestion {
  id: string
  session_id: string
  question_text: string
  question_type: 'mcq' | 'short_answer'
  options?: string[]
  correct_answer: string
  explanation: string
  user_answer?: string
  is_correct?: boolean
  created_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  subject_id: string
  topic: string
  correct_count: number
  wrong_count: number
  last_studied: string
}

export interface DashboardStats {
  totalDocuments: number
  totalQuizzes: number
  averageScore: number
  studyStreak: number
  weakTopics: WeakTopic[]
  recentSessions: ChatSession[]
}

export interface WeakTopic {
  topic: string
  subject_id: string
  correct_count: number
  wrong_count: number
  accuracy: number
}
