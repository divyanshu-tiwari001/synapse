'use client'
import { Bell, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'

const titleMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/chat': 'AI Chat',
  '/upload': 'Upload Documents',
  '/quiz': 'Quiz',
}

export function Navbar() {
  const pathname = usePathname()
  const title = titleMap[pathname] ?? titleMap[Object.keys(titleMap).find(k => pathname.startsWith(k)) ?? ''] ?? 'Synapse'

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-[#0a0a0f]/80 border-b border-white/10">
      <h1 className="text-lg font-semibold text-white">{title}</h1>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
          <Search className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
