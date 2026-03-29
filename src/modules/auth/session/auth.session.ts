import type { User } from '../types/auth.types'

const AUTH_SESSION_KEY = 'smart-feedback-auth-session'

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

export const readAuthSession = (): User | null => {
  if (!canUseStorage()) return null

  try {
    const rawValue = window.localStorage.getItem(AUTH_SESSION_KEY)

    if (!rawValue) return null

    return JSON.parse(rawValue) as User
  } catch {
    return null
  }
}

export const writeAuthSession = (user: User) => {
  if (!canUseStorage()) return
  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user))
}

export const clearAuthSession = () => {
  if (!canUseStorage()) return
  window.localStorage.removeItem(AUTH_SESSION_KEY)
}
