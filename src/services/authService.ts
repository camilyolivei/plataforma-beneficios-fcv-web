export interface LoginCredentials {
  email: string
  password: string
}

interface TemporaryUser extends LoginCredentials {
  name: string
}

const temporaryUserDatabase: { users: TemporaryUser[] } = {
  users: [
    {
    name: 'Usuário de demonstração',
    email: 'usuario@fcv.com.br',
    password: 'Fcv@123456',
    },
  ],
}

export async function login(credentials: LoginCredentials): Promise<void> {
  const email = credentials.email.trim().toLowerCase()
  const user = temporaryUserDatabase.users.find(
    (temporaryUser) => temporaryUser.email.trim().toLowerCase() === email,
  )

  if (!user || user.password !== credentials.password) {
    throw new Error('E-mail ou senha inválidos.')
  }
}