import type { AuthenticatedUser } from './authService'
import { updateUserProfile, type UserProfileUpdate } from './authService'

export type Colaborador = {
  id: string
  usuario_id: string
  matricula: string
  setor: string
  cargo: string
  data_admissao: string
  status: 'ATIVO' | 'INATIVO' | 'AFASTADO'
  telefone?: string
}

const colaboradores: Colaborador[] = [
  {
    id: 'colaborador-camily',
    usuario_id: 'usuario-camily',
    matricula: 'FCV-001',
    setor: 'Administração',
    cargo: 'Administradora',
    data_admissao: '2023-02-01',
    status: 'ATIVO',
    telefone: '(32) 0000-0000',
  },
]

export async function getColaboradorByUsuarioId(usuarioId: string) {
  return colaboradores.find((colaborador) => colaborador.usuario_id === usuarioId) ?? null
}

export async function saveUsuarioProfile(userId: string, changes: UserProfileUpdate): Promise<AuthenticatedUser> {
  return updateUserProfile(userId, changes)
}
