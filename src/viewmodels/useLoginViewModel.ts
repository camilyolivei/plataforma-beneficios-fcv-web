import { useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthViewModel } from './useAuthViewModel'

export function useLoginViewModel() {
  const navigate = useNavigate()
  const { signIn } = useAuthViewModel()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await signIn({ email, password })
      navigate('/dashboard', { replace: true })
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
    isSubmitting,
    setEmail,
    setPassword,
    submit,
  }
}