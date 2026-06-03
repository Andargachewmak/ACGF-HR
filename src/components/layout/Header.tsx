import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, SearchInput } from '@/components/ui'
import { useAuth } from '@/lib/auth'
import { getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/employees': 'People Directory',
  '/recruitment': 'Recruitment & Hiring',
  '/attendance': 'Attendance & Leave',
  '/payroll': 'Payroll & Compensation',
  '/performance': 'Performance Reviews',
  '/analytics': 'HR Analytics',
  '/documents': 'Documents',
  '/settings': 'Settings',
}

const NOTIFICATIONS = [
  { id: 1, text: 'Priya Nair requested annual leave', time: '12m ago', unread: true },
  { id: 2, text: 'Q2 performance reviews are now open', time: '1h ago', unread: true },
  { id: 3, text: 'Payroll for March has been processed', time: '3h ago', unread: false },
]

export function Header() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [search, setSearch] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [unread, setUnread] = useState(NOTIFICATIONS.filter((n) => n.unread).length)
  const popRef = useRef<HTMLDivElement>(null)
  const title = PAGE_TITLES[pathname] ?? 'Nexus HR'

  // Close popovers on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (popRef.current && !popRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!search.trim()) return
    navigate(`/employees?search=${encodeURIComponent(search.trim())}`)
  }

  async function handleLogout() {
    await logout()
    toast.success('Signed out')
    navigate('/login', { replace: true })
  }

  return (
    <header className="h-16 bg-surface-0 border-b border-white/7 flex items-center px-7 gap-4 flex-shrink-0">
      <h1 className="font-display text-lg font-semibold text-white tracking-tight flex-1">{title}</h1>

      <form onSubmit={submitSearch}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search employees..." className="w-56" />
      </form>

      <div className="flex items-center gap-2 relative" ref={popRef}>
        {/* Notifications */}
        <button
          onClick={() => { setNotifOpen((o) => !o); setMenuOpen(false); setUnread(0) }}
          className="relative w-9 h-9 rounded-xl bg-surface-2 border border-white/8 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-surface-3 transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {unread > 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-400 rounded-full ring-2 ring-surface-0" />}
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-12 w-72 bg-surface-1 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-scale-in">
            <div className="px-4 py-3 border-b border-white/7">
              <p className="text-sm font-semibold text-white">Notifications</p>
            </div>
            <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
              {NOTIFICATIONS.map((n) => (
                <div key={n.id} className="px-4 py-3 hover:bg-white/3 transition-colors">
                  <p className="text-sm text-slate-300 leading-snug">{n.text}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{n.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button variant="primary" size="sm" onClick={() => navigate('/employees?new=1')}>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Employee
        </Button>

        {/* User menu */}
        <button
          onClick={() => { setMenuOpen((o) => !o); setNotifOpen(false) }}
          className="w-9 h-9 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-xs font-semibold hover:bg-brand-500/30 transition-colors"
        >
          {getInitials(user?.name ?? 'User')}
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-12 w-56 bg-surface-1 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-scale-in">
            <div className="px-4 py-3 border-b border-white/7">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-slate-300 hover:bg-white/4 hover:text-rose-400 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
