import { DashboardLayout } from '../layouts/DashboardLayout'
import { useAuthViewModel } from '../viewmodels/useAuthViewModel'
import { useDashboardNavigationViewModel } from '../viewmodels/useDashboardNavigationViewModel'
import { ConveniadosListView } from '../components/Conveniados/ConveniadosListView'

export function ConveniadosPage() {
  const { navigateTo, logout } = useDashboardNavigationViewModel()
  const { user } = useAuthViewModel()

  if (!user) return null

  return (
    <DashboardLayout
      activeSection="conveniados"
      onNavigate={navigateTo}
      onLogout={logout}
      userName={user.name}
      userRole={user.role}
      userAvatarUrl={user.avatarUrl}
    >
      <ConveniadosListView />
    </DashboardLayout>
  )
}
