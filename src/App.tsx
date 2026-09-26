import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthViewModelProvider } from './viewmodels/AuthViewModel'
import { useAuthViewModel } from './viewmodels/useAuthViewModel'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'

function LoginRoute() {
  const { user } = useAuthViewModel()

  return user ? <Navigate to="/dashboard" replace /> : <LoginPage />
}

function DashboardRoute() {
  const { user } = useAuthViewModel()

  return user ? <DashboardPage /> : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <AuthViewModelProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/dashboard" element={<DashboardRoute />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthViewModelProvider>
    </BrowserRouter>
  )
}


export default App
