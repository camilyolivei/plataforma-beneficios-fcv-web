import { DashboardLayout } from '../layouts/DashboardLayout'
import { useAuthViewModel } from '../viewmodels/useAuthViewModel'
import { useDashboardNavigationViewModel } from '../viewmodels/useDashboardNavigationViewModel'
import { ConveniadosListView } from '../components/Conveniados/ConveniadosListView'

export function DashboardPage() {
  const { activeSection, currentSection, navigateTo, logout } = useDashboardNavigationViewModel()
  const { user } = useAuthViewModel()

  if (!user) return null

  return (
    <DashboardLayout
      activeSection={activeSection}
      onNavigate={navigateTo}
      onLogout={logout}
      userName={user.name}
      userRole={user.role}
    >
      {activeSection === 'conveniados' ? (
        <ConveniadosListView />
      ) : (
        <>
          <h1 className="dashboard-page-title">{currentSection.title}</h1>
          <div className="dashboard-card">
            <p>{currentSection.description}</p>
            {activeSection !== 'dashboard' && activeSection !== 'ajuda' && (
              <p className="dashboard-placeholder">
                Esta área está preparada para receber o conteúdo do módulo.
              </p>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  )
}

