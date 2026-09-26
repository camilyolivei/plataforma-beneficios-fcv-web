import { createContext } from 'react'
import type { AuthenticatedUser, LoginCredentials } from '../services/authService'

export type AuthViewModelValue = {
  user: AuthenticatedUser | null
  signIn: (credentials: LoginCredentials) => Promise<void>
  updateUser: (user: AuthenticatedUser) => void
  signOut: () => void
}

export const AuthViewModelContext = createContext<AuthViewModelValue | undefined>(undefined)