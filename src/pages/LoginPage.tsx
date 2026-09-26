import { Logo } from '../components/Header/Logo'
import { useLoginViewModel } from '../viewmodels/useLoginViewModel'
import './LoginPage.css'

export function LoginPage() {
  const {
    email,
    password,
    error,
    isSubmitting,
    setEmail,
    setPassword,
    submit,
  } = useLoginViewModel()

  return (
    <main className="login-layout">
      <section className="login-left">
        <div className="form-container">
          <div className="logo-container">
            <Logo />
          </div>
          <h2>Bem-vindo(a)</h2>
          <p>Faça login para acessar a plataforma de benefícios</p>
          <form className="login-form" onSubmit={submit}>
            <div className="input-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                placeholder="Digite seu e-mail"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                placeholder="Digite sua senha"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
                required
              />
            </div>
            {error && <p className="login-error" role="alert">{error}</p>}
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </section>
      <div
        className="login-right"
        role="img"
        aria-label="Ilustração da Fundação Cristiano Varella"
        title="Ilustração da Fundação Cristiano Varella"
      />
    </main>
  )
}