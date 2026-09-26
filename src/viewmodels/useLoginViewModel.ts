import { useState, type SubmitEvent } from 'react'
import { login } from '../services/authService'

export function useLoginViewModel() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      await login({ email, password })
      setSuccess('Login realizado com sucesso.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível entrar. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    email,
    password,
    error,
    success,
    isSubmitting,
    setEmail,
    setPassword,
    submit,
  }
}