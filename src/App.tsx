import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthViewModelProvider } from './viewmodels/AuthViewModel'
import { useAuthViewModel } from './viewmodels/useAuthViewModel'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { ConveniadosPage } from './pages/ConveniadosPage'

function LoginRoute() {
  const { user } = useAuthViewModel()

  return user ? <Navigate to="/dashboard" replace /> : <LoginPage />
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuthViewModel()

  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <AuthViewModelProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/conveniado" element={<ProtectedRoute><ConveniadosPage /></ProtectedRoute>} />
          <Route path="/conveniados" element={<ProtectedRoute><ConveniadosPage /></ProtectedRoute>} />
          <Route path="/colaboradores" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/beneficios" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/utilizacoes" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/campanhas" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/eventos" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/relatorios" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/configuracoes" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/ajuda" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthViewModelProvider>
    </BrowserRouter>
  )
}

export default App
