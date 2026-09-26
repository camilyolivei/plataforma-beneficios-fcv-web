import { useContext } from 'react'
import { AuthViewModelContext } from './authViewModelContext'

export function useAuthViewModel() {
  const context = useContext(AuthViewModelContext)

  if (!context) {
    throw new Error('useAuthViewModel precisa ser usado dentro de AuthViewModelProvider.')
  }

  return context
}