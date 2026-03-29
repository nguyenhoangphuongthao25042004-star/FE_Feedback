import { create } from 'zustand'
import { clearAuthSession, readAuthSession, writeAuthSession } from '../session/auth.session'
import type { User } from '../types/auth.types'

// Kiểu dữ liệu cho store đăng nhập dùng chung toàn ứng dụng
type AuthState = {
  user: User | null
  setUser: (user: User) => void
  logout: () => void
}

// Store này chỉ giữ thông tin người dùng đang đăng nhập
export const useAuthStore = create<AuthState>((set) => ({
  user: readAuthSession(),
  setUser: (user) => {
    writeAuthSession(user)
    set({ user })
  },
  logout: () => {
    clearAuthSession()
    set({ user: null })
  }
}))
