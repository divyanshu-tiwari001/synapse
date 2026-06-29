'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Brain, User } from 'lucide-react'
import { clsx } from 'clsx'
import type { ChatMessage } from '@/types'

interface Props {
  message: ChatMessage
}

export function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user'

  return (
    <div className={clsx('flex gap-3 items-start', isUser && 'flex-row-reverse')}>
      <div
        className={clsx(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
          isUser
            ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
            : 'bg-gradient-to-br from-blue-500 to-purple-600'
        )}
      >
        {isUser ? <User className="w-4 h-4 text-white" /> : <Brain className="w-4 h-4 text-white" />}
      </div>
      <div
        className={clsx(
          'max-w-[75%] rounded-2xl px-4 py-3 text-sm',
          isUser
            ? 'bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-blue-500/20 rounded-tr-sm text-white'
            : 'backdrop-blur-md bg-white/5 border border-white/10 rounded-tl-sm text-gray-100'
        )}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-pre:bg-black/30 prose-pre:border prose-pre:border-white/10"
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
