'use client'
import { useState, useRef, useEffect } from 'react'
import { ChatMessage as ChatMessageComponent } from './ChatMessage'
import { ChatInput } from './ChatInput'
import type { ChatMessage, Subject } from '@/types'
import { Brain } from 'lucide-react'

interface Props {
  subject: Subject
  sessionId?: string
}

export function ChatInterface({ subject, sessionId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(content: string) {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      session_id: sessionId || '',
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      session_id: sessionId || '',
      role: 'assistant',
      content: '',
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, assistantMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          sessionId,
          subjectId: subject.id,
          useRag: true,
        }),
      })

      if (!response.ok) throw new Error('Chat failed')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantMessage.id ? { ...m, content: m.content + chunk } : m
            )
          )
        }
      }
    } catch {
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMessage.id
            ? { ...m, content: 'Sorry, something went wrong. Please try again.' }
            : m
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-blue-500/20 flex items-center justify-center">
              <Brain className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-white">Chat about {subject.name}</p>
              <p className="text-sm text-gray-400 mt-1">
                Ask anything — I&apos;ll help you understand concepts from your uploaded materials
              </p>
            </div>
          </div>
        )}
        {messages.map(message => (
          <ChatMessageComponent key={message.id} message={message} />
        ))}
        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  )
}
