import { useEffect, useRef } from 'react'
import {
  dashboardSections,
  type DashboardSection,
} from './useDashboardNavigationViewModel'

// Lista plana de todos os itens navegáveis (na ordem do menu, excluindo Sair)
export const sidebarNavItems: DashboardSection[] = [
  ...Object.keys(dashboardSections) as DashboardSection[],
]

type UseSidebarViewModelProps = {
  activeSection: DashboardSection
  onNavigate: (section: DashboardSection) => void
}

export function useSidebarViewModel({ activeSection, onNavigate }: UseSidebarViewModelProps) {
  const sidebarRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return

      e.preventDefault()

      const total = sidebarNavItems.length
      const currentIndex = sidebarNavItems.indexOf(activeSection)
      const nextIndex =
        e.key === 'ArrowDown'
          ? (currentIndex + 1) % total
          : (currentIndex - 1 + total) % total

      const nextSection = sidebarNavItems[nextIndex]

      onNavigate(nextSection)

      // Move o foco do DOM para o novo botão ativo, limpando o foco do anterior
      requestAnimationFrame(() => {
        const btn = sidebarRef.current?.querySelector<HTMLButtonElement>(
          `[data-section="${nextSection}"]`
        )
        btn?.focus({ preventScroll: true })
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeSection, onNavigate])

  return { sidebarRef }
}
