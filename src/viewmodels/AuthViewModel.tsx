import { useState, type PropsWithChildren } from 'react'
import { login, type AuthenticatedUser, type LoginCredentials } from '../services/authService'
import { AuthViewModelContext } from './authViewModelContext'

export function AuthViewModelProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null)

  async function signIn(credentials: LoginCredentials) {
    const authenticatedUser = await login(credentials)
    setUser(authenticatedUser)
  }

  function signOut() {
    setUser(null)
  }

  function updateUser(updatedUser: AuthenticatedUser) {
    setUser(updatedUser)
  }

  return (
    <AuthViewModelContext.Provider value={{ user, signIn, updateUser, signOut }}>
      {children}
    </AuthViewModelContext.Provider>
  )
}