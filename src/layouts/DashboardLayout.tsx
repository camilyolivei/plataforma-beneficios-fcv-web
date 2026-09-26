import type { ReactNode } from 'react'
import { Sidebar } from '../components/Sidebar/Sidebar'
import type { DashboardSection } from '../viewmodels/useDashboardNavigationViewModel'
import './DashboardLayout.css'

type DashboardLayoutProps = {
  children: ReactNode
  activeSection: DashboardSection
  onNavigate: (section: DashboardSection) => void
  onLogout: () => void
}

export function DashboardLayout({ children, activeSection, onNavigate, onLogout }: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout">
      <Sidebar activeSection={activeSection} onNavigate={onNavigate} onLogout={onLogout} />
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  )
}
