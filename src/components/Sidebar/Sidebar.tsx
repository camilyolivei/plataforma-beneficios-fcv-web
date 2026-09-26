import { useEffect, useRef } from 'react'
import { 
  Home, 
  User, 
  Gift, 
  Store, 
  ReceiptText, 
  Megaphone, 
  Calendar, 
  FileText, 
  Settings, 
  HelpCircle, 
  LogOut 
} from 'lucide-react'
import type { DashboardSection } from '../../viewmodels/useDashboardNavigationViewModel'
import logoFcv from '../../assets/images/brand/logofcv_blue.svg'
import './Sidebar.css'

type SidebarProps = {
  activeSection: DashboardSection
  onNavigate: (section: DashboardSection) => void
  onLogout: () => void
}

const navigationGroups: {
  label: string
  items: { id: DashboardSection; label: string; icon: typeof Home }[]
}[] = [
  {
    label: 'Principal',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: Home }],
  },
  {
    label: 'Gestão',
    items: [
      { id: 'colaboradores', label: 'Colaboradores', icon: User },
      { id: 'beneficios', label: 'Benefícios', icon: Gift },
      { id: 'conveniados', label: 'Conveniados', icon: Store },
    ],
  },
  {
    label: 'Operação',
    items: [
      { id: 'utilizacoes', label: 'Utilizações', icon: ReceiptText },
      { id: 'campanhas', label: 'Campanhas', icon: Megaphone },
      { id: 'eventos', label: 'Eventos', icon: Calendar },
    ],
  },
  {
    label: 'Administração',
    items: [
      { id: 'relatorios', label: 'Relatórios', icon: FileText },
      { id: 'configuracoes', label: 'Configurações', icon: Settings },
    ],
  },
]

// Lista plana de todos os itens navegáveis (excluindo Sair)
const allNavItems: DashboardSection[] = [
  ...navigationGroups.flatMap((g) => g.items.map((i) => i.id)),
  'ajuda',
]

export function Sidebar({ activeSection, onNavigate, onLogout }: SidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return

      e.preventDefault()

      const currentIndex = allNavItems.indexOf(activeSection)
      const total = allNavItems.length
      let nextSection: DashboardSection

      if (e.key === 'ArrowDown') {
        nextSection = allNavItems[(currentIndex + 1) % total]
      } else {
        nextSection = allNavItems[(currentIndex - 1 + total) % total]
      }

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

  return (
    <aside className="sidebar" ref={sidebarRef}>
      <div className="sidebar-logo">
        <img src={logoFcv} alt="Fundação Cristiano Varella" />
      </div>

      <nav className="sidebar-menu" aria-label="Navegação principal">
        {navigationGroups.map((group) => (
          <div className="sidebar-group" key={group.label}>
            {group.items.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  data-section={item.id}
                  className={`sidebar-item${isActive ? ' active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => onNavigate(item.id)}
                >
                  <span className="sidebar-icon" aria-hidden="true">
                    <Icon size={19} strokeWidth={1.8} />
                  </span>
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-menu-bottom">
        <button
          type="button"
          data-section="ajuda"
          className={`sidebar-item${activeSection === 'ajuda' ? ' active' : ''}`}
          aria-current={activeSection === 'ajuda' ? 'page' : undefined}
          onClick={() => onNavigate('ajuda')}
        >
          <span className="sidebar-icon" aria-hidden="true">
            <HelpCircle size={19} strokeWidth={1.8} />
          </span>
          <span>Ajuda</span>
        </button>
        <button type="button" className="sidebar-item sidebar-item-logout" onClick={onLogout}>
          <span className="sidebar-icon" aria-hidden="true">
            <LogOut size={19} strokeWidth={1.8} />
          </span>
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )
}
