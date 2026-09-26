export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthenticatedUser {
  id: string
  email: string
  name: string
  role: string
  perfil_id: string
  status: 'ATIVO' | 'INATIVO'
  data_criacao: string
  avatarUrl?: string
}

interface TemporaryUser extends AuthenticatedUser {
  password: string
  alternativePasswords?: string[]
  alternativeEmails?: string[]
}

const temporaryUserDatabase: { users: TemporaryUser[] } = {
  users: [
    {
      id: 'usuario-camily',
      name: 'Camily',
      email: 'c@g.com',
      alternativeEmails: [
        'c@g.com',
        'camily',
        'camily@gmail.com',
        'camily@fcv.org.br',
        'camily@fcv.org',
        'camily@fcv.com.br',
        'camily.oliveira@fcv.org.br',
      ],
      role: 'Administrador',
      perfil_id: 'perfil-fcv-administrador',
      status: 'ATIVO',
      data_criacao: '2025-01-15',
      password: 'c'
    },
    {
      id: 'usuario-kaio',
      name: 'kaio',
      email: 'kaio@gmail.com',
      alternativeEmails: ['kaio@gmail.com', 'kaio', 'kaio@fcv.org.br'],
      role: 'Administrador',
      perfil_id: 'perfil-fcv-administrador',
      status: 'ATIVO',
      data_criacao: '2025-02-10',
      password: 'kaio123'
    },
  ],
}

export async function login(credentials: LoginCredentials): Promise<AuthenticatedUser> {
  const cleanEmail = credentials.email.trim().toLowerCase()
  const rawPassword = credentials.password
  const cleanPassword = credentials.password.trim()

  // Procura o usuário por e-mail ou apelidos cadastrados
  let user = temporaryUserDatabase.users.find((candidate) => {
    const mainMatch = candidate.email.trim().toLowerCase() === cleanEmail
    const altMatch = candidate.alternativeEmails?.some(
      (alt) => alt.trim().toLowerCase() === cleanEmail,
    )
    return mainMatch || altMatch
  })

  // Se o usuário digitou algum outro e-mail válido para testar, usa o usuário padrão de demonstração
  if (!user && cleanEmail.includes('@')) {
    user = temporaryUserDatabase.users[0]
  }

  if (!user) {
    throw new Error('E-mail não encontrado. Utilize "c@g.com" para entrar.')
  }

  // Verifica a senha aceitando a oficial com ou sem espaços
  const isMatch =
    user.password === rawPassword ||
    user.password === cleanPassword ||
    user.password.toLowerCase() === cleanPassword.toLowerCase()

  if (!isMatch) {
    throw new Error('Senha incorreta.')
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    perfil_id: user.perfil_id,
    status: user.status,
    data_criacao: user.data_criacao,
    avatarUrl: user.avatarUrl,
  }
}

export type UserProfileUpdate = Partial<Pick<AuthenticatedUser, 'name' | 'email' | 'avatarUrl'>>

export async function updateUserProfile(userId: string, changes: UserProfileUpdate): Promise<AuthenticatedUser> {
  const user = temporaryUserDatabase.users.find((temporaryUser) => temporaryUser.id === userId)

  if (!user) throw new Error('Usuário não encontrado.')

  if (changes.name !== undefined) user.name = changes.name.trim()
  if (changes.email !== undefined) user.email = changes.email.trim().toLowerCase()
  if (changes.avatarUrl !== undefined) user.avatarUrl = changes.avatarUrl

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    perfil_id: user.perfil_id,
    status: user.status,
    data_criacao: user.data_criacao,
    avatarUrl: user.avatarUrl,
  }
}