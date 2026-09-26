export interface LoginCredentials {
  email: string
  password: string
}

interface ApiError {
  message?: string
}

const apiUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

export async function login(credentials: LoginCredentials): Promise<void> {
  const response = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null) as ApiError | null
    throw new Error(body?.message || 'E-mail ou senha inválidos.')
  }
}