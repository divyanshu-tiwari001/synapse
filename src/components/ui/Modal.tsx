'use client'
import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { clsx } from 'clsx'

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function Modal({ open, onOpenChange, title, description, children, className }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={clsx(
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-lg rounded-2xl p-6',
            'backdrop-blur-md bg-[#12121a] border border-white/10',
            'shadow-2xl shadow-black/50',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            className
          )}
        >
          {(title || description) && (
            <div className="mb-4">
              {title && (
                <Dialog.Title className="text-lg font-semibold text-white">{title}</Dialog.Title>
              )}
              {description && (
                <Dialog.Description className="mt-1 text-sm text-gray-400">{description}</Dialog.Description>
              )}
            </div>
          )}
          <Dialog.Close className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <X className="h-4 w-4" />
          </Dialog.Close>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
