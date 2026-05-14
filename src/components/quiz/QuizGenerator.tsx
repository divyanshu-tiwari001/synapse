'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import toast from 'react-hot-toast'

interface Subject {
  id: string
  name: string
  exam_type: string
}

interface Props {
  subjects: Subject[]
}

export function QuizGenerator({ subjects }: Props) {
  const router = useRouter()
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '')
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState(3)
  const [count, setCount] = useState(5)
  const [loading, setLoading] = useState(false)

  async function generate() {
    if (!topic.trim()) {
      toast.error('Please enter a topic')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectId, topic, difficulty, questionCount: count }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push(`/quiz/${data.session.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate quiz')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-6 space-y-5">
      <h3 className="text-base font-semibold text-white">Generate New Quiz</h3>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1.5">Subject</label>
          <select
            value={subjectId}
            onChange={e => setSubjectId(e.target.value)}
            className="w-full rounded-lg px-4 py-2.5 text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id} className="bg-[#12121a]">
                {s.name} ({s.exam_type})
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Topic"
          placeholder="e.g. Newton's Laws, Integration, Cell Biology"
          value={topic}
          onChange={e => setTopic(e.target.value)}
        />

        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1.5">
            Difficulty: {['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'][difficulty - 1]}
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={difficulty}
            onChange={e => setDifficulty(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1.5">
            Questions: {count}
          </label>
          <input
            type="range"
            min={3}
            max={15}
            step={1}
            value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
      </div>

      <Button onClick={generate} loading={loading} className="w-full" size="lg">
        Generate Quiz
      </Button>
    </div>
  )
}
