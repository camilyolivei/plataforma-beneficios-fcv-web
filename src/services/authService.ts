export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthenticatedUser {
  email: string
  name: string
  role: string
}

interface TemporaryUser extends AuthenticatedUser {
  password: string
}

const temporaryUserDatabase: { users: TemporaryUser[] } = {
  users: [
    {
      name: 'Camily',
      email: 'usuario@fcv.com.br',
      role: 'Administrador',
      password: 'Fcv@123456',
    },
  ],
}

export async function login(credentials: LoginCredentials): Promise<AuthenticatedUser> {
  const email = credentials.email.trim().toLowerCase()
  const user = temporaryUserDatabase.users.find(
    (temporaryUser) => temporaryUser.email.trim().toLowerCase() === email,
  )

  if (!user || user.password !== credentials.password) {
    throw new Error('E-mail ou senha inválidos.')
  }

  return { email: user.email, name: user.name, role: user.role }
}