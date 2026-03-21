//phân quyền UI, quản lý user global
import { create } from 'zustand'
import type { User } from '../types/auth.types'

type AuthState = {
    user: User | null
    setUser: (user: User) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set ({ user: null })
    }
))