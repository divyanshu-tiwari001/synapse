-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists vector;

-- ============================================================
-- SUBJECTS
-- ============================================================
create table if not exists subjects (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  exam_type   text not null check (exam_type in ('JEE', 'NEET', 'CBSE', 'OTHER')),
  description text,
  color       text default '#4f46e5',
  created_at  timestamptz not null default now()
);

-- Seed default subjects
insert into subjects (name, exam_type, color) values
  ('Physics',   'JEE',  '#3b82f6'),
  ('Chemistry', 'JEE',  '#8b5cf6'),
  ('Maths',     'JEE',  '#ec4899'),
  ('Biology',   'NEET', '#10b981'),
  ('Physics',   'NEET', '#f59e0b'),
  ('Chemistry', 'NEET', '#6366f1')
on conflict do nothing;

-- ============================================================
-- DOCUMENTS
-- ============================================================
create table if not exists documents (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  subject_id  uuid not null references subjects(id) on delete cascade,
  title       text not null,
  file_path   text,
  file_size   bigint,
  status      text not null default 'processing' check (status in ('processing', 'ready', 'failed')),
  chunk_count int  default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- DOCUMENT CHUNKS
-- ============================================================
create table if not exists document_chunks (
  id         uuid primary key default uuid_generate_v4(),
  document_id uuid not null references documents(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  subject_id uuid not null references subjects(id) on delete cascade,
  content    text not null,
  embedding  vector(1536),
  chunk_index int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists document_chunks_embedding_idx
  on document_chunks using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- ============================================================
-- CHAT SESSIONS
-- ============================================================
create table if not exists chat_sessions (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  subject_id uuid references subjects(id) on delete set null,
  title      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- CHAT MESSAGES
-- ============================================================
create table if not exists chat_messages (
  id         uuid primary key default uuid_generate_v4(),
  session_id uuid not null references chat_sessions(id) on delete cascade,
  role       text not null check (role in ('user', 'assistant', 'system')),
  content    text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- QUIZ SESSIONS
-- ============================================================
create table if not exists quiz_sessions (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  subject_id      uuid references subjects(id) on delete set null,
  topic           text not null,
  difficulty      int  not null default 3 check (difficulty between 1 and 5),
  score           int,
  total_questions int,
  completed_at    timestamptz,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- QUIZ QUESTIONS
-- ============================================================
create table if not exists quiz_questions (
  id            uuid primary key default uuid_generate_v4(),
  session_id    uuid not null references quiz_sessions(id) on delete cascade,
  question_text text not null,
  question_type text not null check (question_type in ('mcq', 'short_answer')),
  options       jsonb,
  correct_answer text not null,
  user_answer   text,
  explanation   text,
  is_correct    boolean,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- USER PROGRESS
-- ============================================================
create table if not exists user_progress (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  subject_id      uuid references subjects(id) on delete cascade,
  topic           text,
  score           numeric(5,2),
  sessions_count  int default 0,
  last_studied_at timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (user_id, subject_id, topic)
);

-- ============================================================
-- VECTOR SEARCH FUNCTION
-- ============================================================
create or replace function match_documents(
  query_embedding   vector(1536),
  match_threshold   float,
  match_count       int,
  filter_subject_id uuid default null,
  filter_user_id    uuid default null
)
returns table (
  id          uuid,
  content     text,
  document_id uuid,
  subject_id  uuid,
  similarity  float
)
language plpgsql
as $$
begin
  return query
  select
    dc.id,
    dc.content,
    dc.document_id,
    dc.subject_id,
    1 - (dc.embedding <=> query_embedding) as similarity
  from document_chunks dc
  where
    (filter_subject_id is null or dc.subject_id = filter_subject_id)
    and (filter_user_id   is null or dc.user_id   = filter_user_id)
    and 1 - (dc.embedding <=> query_embedding) > match_threshold
  order by dc.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table documents        enable row level security;
alter table document_chunks  enable row level security;
alter table chat_sessions    enable row level security;
alter table chat_messages    enable row level security;
alter table quiz_sessions    enable row level security;
alter table quiz_questions   enable row level security;
alter table user_progress    enable row level security;

-- Documents
create policy "users_own_documents" on documents
  for all using (auth.uid() = user_id);

-- Document chunks
create policy "users_own_chunks" on document_chunks
  for all using (auth.uid() = user_id);

-- Chat sessions
create policy "users_own_chat_sessions" on chat_sessions
  for all using (auth.uid() = user_id);

-- Chat messages (via session)
create policy "users_own_chat_messages" on chat_messages
  for all using (
    exists (
      select 1 from chat_sessions cs
      where cs.id = chat_messages.session_id and cs.user_id = auth.uid()
    )
  );

-- Quiz sessions
create policy "users_own_quiz_sessions" on quiz_sessions
  for all using (auth.uid() = user_id);

-- Quiz questions (via session)
create policy "users_own_quiz_questions" on quiz_questions
  for all using (
    exists (
      select 1 from quiz_sessions qs
      where qs.id = quiz_questions.session_id and qs.user_id = auth.uid()
    )
  );

-- User progress
create policy "users_own_progress" on user_progress
  for all using (auth.uid() = user_id);

-- Subjects are public read
create policy "subjects_public_read" on subjects
  for select using (true);

-- ============================================================
-- STORAGE
-- ============================================================
insert into storage.buckets (id, name, public) values ('documents', 'documents', false)
on conflict do nothing;

create policy "users_upload_docs" on storage.objects
  for insert with check (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "users_read_own_docs" on storage.objects
  for select using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "users_delete_own_docs" on storage.objects
  for delete using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);
