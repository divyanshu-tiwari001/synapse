'use client'
import { useState, useCallback } from 'react'
import { Upload, FileText, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'

interface Props {
  subjectId: string
  onUploadComplete?: () => void
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

export function UploadZone({ subjectId, onUploadComplete }: Props) {
  const [state, setState] = useState<UploadState>('idle')
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState('')
  const [progress, setProgress] = useState(0)

  const upload = useCallback(
    async (file: File) => {
      if (!file.name.endsWith('.pdf')) {
        toast.error('Only PDF files are supported')
        return
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File must be under 50 MB')
        return
      }

      setFileName(file.name)
      setState('uploading')
      setProgress(20)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('subjectId', subjectId)

      try {
        setProgress(50)
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        setProgress(90)

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Upload failed')
        }

        setProgress(100)
        setState('success')
        toast.success('Document uploaded and processed!')
        onUploadComplete?.()
      } catch (err) {
        setState('error')
        toast.error(err instanceof Error ? err.message : 'Upload failed')
      }
    },
    [subjectId, onUploadComplete]
  )

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) upload(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) upload(file)
  }

  const resetState = () => {
    setState('idle')
    setFileName('')
    setProgress(0)
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={clsx(
        'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all duration-200 cursor-pointer group',
        dragOver
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-white/20 hover:border-white/40 hover:bg-white/5',
        state === 'success' && 'border-emerald-500 bg-emerald-500/10',
        state === 'error' && 'border-red-500 bg-red-500/10'
      )}
      onClick={() => state === 'idle' && document.getElementById('file-input')?.click()}
    >
      <input
        id="file-input"
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleChange}
      />

      {state === 'idle' && (
        <>
          <Upload className="w-12 h-12 text-gray-400 group-hover:text-blue-400 transition-colors mb-4" />
          <p className="text-base font-medium text-white">Drop your PDF here</p>
          <p className="text-sm text-gray-400 mt-1">or click to browse</p>
          <p className="text-xs text-gray-500 mt-3">PDF files up to 50 MB</p>
        </>
      )}

      {state === 'uploading' && (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
          <p className="text-sm font-medium text-white">Processing {fileName}...</p>
          <div className="w-48 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">{progress}%</p>
        </div>
      )}

      {state === 'success' && (
        <div className="flex flex-col items-center gap-4" onClick={resetState}>
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          <div className="text-center">
            <p className="text-sm font-medium text-white flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {fileName}
            </p>
            <p className="text-xs text-emerald-400 mt-1">Uploaded and indexed successfully</p>
          </div>
          <p className="text-xs text-gray-400">Click to upload another</p>
        </div>
      )}

      {state === 'error' && (
        <div className="flex flex-col items-center gap-4" onClick={resetState}>
          <XCircle className="w-12 h-12 text-red-400" />
          <p className="text-sm font-medium text-white">Upload failed</p>
          <p className="text-xs text-gray-400">Click to try again</p>
        </div>
      )}
    </div>
  )
}
