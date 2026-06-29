import * as React from 'react'
import { clsx } from 'clsx'

interface CardProps {
  title?: string
  className?: string
  children: React.ReactNode
}

export function Card({ title, className, children }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-6',
        className
      )}
    >
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      )}
      {children}
    </div>
  )
}
