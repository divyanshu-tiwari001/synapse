'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  MessageSquare,
  Upload,
  Trophy,
  LogOut,
  Brain,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { clsx } from 'clsx'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FeatureFlag } from '@/components/ui/FeatureFlag'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, feature: 'DASHBOARD' as const },
  { href: '/chat', label: 'AI Chat', icon: MessageSquare, feature: 'CHAT' as const },
  { href: '/upload', label: 'Upload', icon: Upload, feature: 'UPLOAD' as const },
  { href: '/quiz', label: 'Quiz', icon: Trophy, feature: 'QUIZ' as const },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside
      className={clsx(
        'flex flex-col h-screen sticky top-0 transition-all duration-300',
        'backdrop-blur-md bg-[#12121a] border-r border-white/10',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={clsx('flex items-center gap-3 p-4 border-b border-white/10', collapsed && 'justify-center')}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Synapse
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, feature }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          const item = (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200',
                collapsed && 'justify-center',
                isActive
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
              title={collapsed ? label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{label}</span>}
              {isActive && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
              )}
            </Link>
          )

          if (feature === 'DASHBOARD') return item
          return (
            <FeatureFlag key={href} feature={feature}>
              {item}
            </FeatureFlag>
          )
        })}
      </nav>

      {/* User / Collapse */}
      <div className="p-3 border-t border-white/10 space-y-2">
        {!collapsed && user && (
          <div className="px-3 py-2">
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={clsx(
            'flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200',
            collapsed && 'justify-center'
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(c => !c)}
          className="flex items-center justify-center w-full rounded-lg p-2 text-gray-500 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  )
}
