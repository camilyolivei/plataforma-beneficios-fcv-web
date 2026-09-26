import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthViewModel } from './useAuthViewModel'

export const dashboardSections = {
  dashboard: {
    title: 'Dashboard',
    description: 'Visão geral da plataforma de benefícios.',
  },
  colaboradores: {
    title: 'Colaboradores',
    description: 'Cadastro e gestão dos colaboradores da Fundação.',
  },
  beneficios: {
    title: 'Benefícios',
    description: 'Gestão dos benefícios disponíveis para os colaboradores.',
  },
  conveniados: {
    title: 'Conveniados',
    description: 'Gestão dos parceiros e estabelecimentos conveniados.',
  },
  utilizacoes: {
    title: 'Utilizações',
    description: 'Acompanhamento da utilização dos benefícios.',
  },
  campanhas: {
    title: 'Campanhas',
    description: 'Gestão das campanhas da plataforma.',
  },
  eventos: {
    title: 'Eventos',
    description: 'Gestão dos eventos para os colaboradores.',
  },
  relatorios: {
    title: 'Relatórios',
    description: 'Indicadores e relatórios da plataforma.',
  },
  configuracoes: {
    title: 'Configurações',
    description: 'Preferências e configurações da plataforma.',
  },
  ajuda: {
    title: 'Ajuda',
    description: 'Informações de suporte à plataforma.',
  },
} as const

export type DashboardSection = keyof typeof dashboardSections

export function useDashboardNavigationViewModel() {
  const navigate = useNavigate()
  const { signOut } = useAuthViewModel()
  const [activeSection, setActiveSection] = useState<DashboardSection>('dashboard')

  function logout() {
    signOut()
    navigate('/login', { replace: true })
  }

  return {
    activeSection,
    currentSection: dashboardSections[activeSection],
    navigateTo: setActiveSection,
    logout,
  }
}