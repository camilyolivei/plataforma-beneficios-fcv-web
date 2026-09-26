import { useState } from 'react'
import {
  dashboardSections,
  type DashboardSection,
} from './useDashboardNavigationViewModel'

const searchPlaceholders: Record<DashboardSection, string> = {
  dashboard: 'Buscar por colaborador, benefício ou conveniado...',
  colaboradores: 'Buscar por nome, matrícula ou e-mail...',
  beneficios: 'Buscar por benefício ou categoria...',
  conveniados: 'Buscar por conveniado, CNPJ ou cidade...',
  utilizacoes: 'Buscar por colaborador, benefício ou status...',
  campanhas: 'Buscar por campanha ou público-alvo...',
  eventos: 'Buscar por evento, data ou local...',
  relatorios: 'Buscar por relatório ou período...',
  configuracoes: 'Buscar por configuração...',
  ajuda: 'Buscar por assunto ou palavra-chave...',
}

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR')
}

export function useHeaderViewModel(
  activeSection: DashboardSection,
  onNavigate: (section: DashboardSection) => void,
) {
  const [query, setQuery] = useState('')
  const [activePopover, setActivePopover] = useState<'notifications' | 'user-menu' | null>(null)
  const normalizedQuery = normalize(query.trim())

  const searchResults = normalizedQuery
    ? (Object.keys(dashboardSections) as DashboardSection[])
      .filter((section) => {
        const item = dashboardSections[section]
        return normalize(`${item.title} ${item.description}`).includes(normalizedQuery)
      })
      .slice(0, 5)
      .map((id) => ({ id, ...dashboardSections[id] }))
    : []

  function selectSearchResult(section: DashboardSection) {
    onNavigate(section)
    setQuery('')
  }

  function toggleNotifications() {
    setActivePopover((current) => current === 'notifications' ? null : 'notifications')
  }

  function toggleUserMenu() {
    setActivePopover((current) => current === 'user-menu' ? null : 'user-menu')
  }

  return {
    query,
    setQuery,
    placeholder: searchPlaceholders[activeSection],
    searchResults,
    selectSearchResult,
    isNotificationsOpen: activePopover === 'notifications',
    isUserMenuOpen: activePopover === 'user-menu',
    toggleNotifications,
    toggleUserMenu,
    closePopovers: () => setActivePopover(null),
  }
}