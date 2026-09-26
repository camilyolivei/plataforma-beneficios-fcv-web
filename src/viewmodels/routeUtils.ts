import { dashboardSections, type DashboardSection } from './useDashboardNavigationViewModel'

/**
 * Mapeamentos conhecidos para exibição amigável de telas nativas do sistema.
 */
const KNOWN_ROUTE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  colaboradores: 'Colaboradores',
  beneficios: 'Benefícios',
  conveniados: 'Conveniados',
  conveniado: 'Conveniados',
  usuarios: 'Usuários',
  usuario: 'Usuários',
  utilizacoes: 'Utilizações',
  campanhas: 'Campanhas',
  eventos: 'Eventos',
  relatorios: 'Relatórios',
  configuracoes: 'Configurações',
  ajuda: 'Ajuda',
}

/**
 * Converte qualquer caminho de rota dinamicamente em um nome legível para o botão de retorno,
 * sem depender de uma lista fixa fechada de telas.
 *
 * Exemplos:
 * - "/dashboard" -> "Dashboard"
 * - "/relatorios" -> "Relatórios"
 * - "/beneficios" -> "Benefícios"
 * - "/usuarios" -> "Usuários"
 * - "/tela-a" -> "Tela A"
 * - "/pedidos-novos" -> "Pedidos Novos"
 */
export function getScreenTitleFromRoute(route?: string): string {
  if (!route || route === '/' || route === '/perfil') {
    return 'Dashboard'
  }

  // Remove parâmetros de busca (?...) e âncoras (#...)
  const cleanRoute = route.split('?')[0].split('#')[0].trim()
  const segments = cleanRoute.split('/').filter(Boolean)

  if (segments.length === 0) {
    return 'Dashboard'
  }

  const lastSegment = segments[segments.length - 1].toLowerCase()

  // Se mapeado nas seções do sistema
  if (KNOWN_ROUTE_TITLES[lastSegment]) {
    return KNOWN_ROUTE_TITLES[lastSegment]
  }

  if (lastSegment in dashboardSections) {
    return dashboardSections[lastSegment as DashboardSection].title
  }

  // Resolução dinâmica para qualquer outra tela (ex.: 'tela-a' -> 'Tela A')
  return lastSegment
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Determina qual seção da sidebar deve ficar ativa no DashboardLayout
 * com base na rota de origem.
 */
export function getOriginSectionFromRoute(route?: string): DashboardSection {
  if (!route) return 'dashboard'
  const cleanRoute = route.split('?')[0].split('#')[0].trim()
  const segments = cleanRoute.split('/').filter(Boolean)
  const segment = segments[0]?.toLowerCase() || ''

  if (segment === 'conveniado' || segment === 'conveniados') {
    return 'conveniados'
  }

  if (segment in dashboardSections) {
    return segment as DashboardSection
  }

  return 'dashboard'
}
