import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from './supabase'

const IS_MOCK = !import.meta.env.VITE_SUPABASE_URL

export interface AuthUser {
  name: string
  email: string
  role: string
}

interface AuthState {
  user: AuthUser | null
  hydrated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  _setHydrated: () => void
}

function nameFromEmail(email: string) {
  const handle = email.split('@')[0].replace(/[._-]+/g, ' ')
  return handle.replace(/\b\w/g, (c) => c.toUpperCase())
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hydrated: false,
      _setHydrated: () => set({ hydrated: true }),

      login: async (email, password) => {
        if (!email || !password) throw new Error('Email and password are required')

        // Offline / demo mode — works without any backend
        if (IS_MOCK) {
          if (password.length < 4) throw new Error('Password must be at least 4 characters')
          await new Promise((r) => setTimeout(r, 350)) // feel of a request
          set({ user: { name: nameFromEmail(email), email, role: 'HR Manager' } })
          return
        }

        // Supabase-backed auth
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error || !data.user) throw new Error(error?.message ?? 'Invalid credentials')
        set({
          user: {
            name: data.user.user_metadata?.name ?? nameFromEmail(email),
            email: data.user.email ?? email,
            role: data.user.user_metadata?.role ?? 'Employee',
          },
        })
      },

      logout: async () => {
        if (!IS_MOCK) await supabase.auth.signOut().catch(() => {})
        set({ user: null })
      },
    }),
    {
      name: 'nexus-hr-auth',
      partialize: (s) => ({ user: s.user }),
      onRehydrateStorage: () => (state) => state?._setHydrated(),
    },
  ),
)

export const IS_DEMO_AUTH = IS_MOCK
