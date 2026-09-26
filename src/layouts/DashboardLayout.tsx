import type { ReactNode } from 'react'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { TopBar } from '../components/TopBar/TopBar'
import type { DashboardSection } from '../viewmodels/useDashboardNavigationViewModel'
import './DashboardLayout.css'

type DashboardLayoutProps = {
  children: ReactNode
  activeSection: DashboardSection
  onNavigate: (section: DashboardSection) => void
  onLogout: () => void
  userName?: string
  userRole?: string
  userAvatarUrl?: string
}

export function DashboardLayout({ children, activeSection, onNavigate, onLogout, userName, userRole, userAvatarUrl }: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout">
      <div className="dashboard-body">
        <TopBar
          activeSection={activeSection}
          userName={userName}
          userRole={userRole}
          userAvatarUrl={userAvatarUrl}
          onNavigate={onNavigate}
          onLogout={onLogout}
        />
        <main className="dashboard-content">
          <div className="dashboard-workspace">
            <Sidebar activeSection={activeSection} onNavigate={onNavigate} onLogout={onLogout} />
            <section className="dashboard-page-content">{children}</section>
          </div>
        </main>
      </div>
    </div>
  )
}
