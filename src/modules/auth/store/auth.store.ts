import { create } from 'zustand'
import type { User } from '../types/auth.types'

// Kiểu dữ liệu cho store đăng nhập dùng chung toàn ứng dụng
type AuthState = {
  user: User | null
  setUser: (user: User) => void
  logout: () => void
}

// Store này chỉ giữ thông tin người dùng đang đăng nhập
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null })
}))
