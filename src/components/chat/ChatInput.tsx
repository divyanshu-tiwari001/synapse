'use client'
import { useState, useRef, KeyboardEvent } from 'react'
import { Send } from 'lucide-react'
import { clsx } from 'clsx'

interface Props {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ onSend, disabled, placeholder = 'Ask anything...' }: Props) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleSend() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleInput() {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 160) + 'px'
    }
  }

  return (
    <div className="flex items-end gap-3">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={clsx(
            'w-full resize-none rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500',
            'backdrop-blur-md bg-white/5 border border-white/10',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50',
            'transition-all duration-200 overflow-hidden',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          style={{ maxHeight: 160 }}
        />
      </div>
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className={clsx(
          'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
          'bg-gradient-to-br from-blue-600 to-purple-600',
          'hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/25',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none'
        )}
      >
        <Send className="w-4 h-4 text-white" />
      </button>
    </div>
  )
}
