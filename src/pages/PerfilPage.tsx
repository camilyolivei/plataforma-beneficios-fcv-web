import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Camera,
  CheckCircle2,
  Info,
  Mail,
  Save,
  Trash2,
  UserRound,
} from 'lucide-react'
import { useRef } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { useDashboardNavigationViewModel } from '../viewmodels/useDashboardNavigationViewModel'
import { usePerfilViewModel } from '../viewmodels/usePerfilViewModel'
import './PerfilPage.css'

export function PerfilPage() {
  const { navigateTo, logout } = useDashboardNavigationViewModel()
  const profile = usePerfilViewModel()
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!profile.user) return null

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      profile.onAvatarFileSelected(file)
    }
    // Reseta o valor do input para permitir selecionar o mesmo arquivo novamente se necessário
    event.target.value = ''
  }

  return (
    <DashboardLayout
      activeSection={profile.originSection}
      onNavigate={navigateTo}
      onLogout={logout}
      userName={profile.user.name}
      userRole={profile.user.role}
      userAvatarUrl={profile.user.avatarUrl}
    >
      <div className="profile-page">
        <div className="profile-heading">
          <div>
            <span className="profile-eyebrow">Conta FCV</span>
            <h1>Meu perfil</h1>
            <p>Atualize seu nome ou foto de perfil e consulte suas informações cadastrais.</p>
          </div>
          <button
            className="profile-back"
            type="button"
            onClick={profile.requestBack}
            aria-label={profile.backButtonLabel}
          >
            <ArrowLeft size={16} />
            {profile.backButtonLabel}
          </button>
        </div>

        {profile.message && (
          <div className="profile-feedback profile-feedback-success" role="status">
            <CheckCircle2 size={17} />
            <span>{profile.message}</span>
          </div>
        )}

        {profile.infoMessage && (
          <div className="profile-feedback profile-feedback-info" role="status">
            <Info size={17} />
            <span>{profile.infoMessage}</span>
          </div>
        )}

        {profile.error && (
          <div className="profile-feedback profile-feedback-error" role="alert">
            <AlertCircle size={17} />
            <span>{profile.error}</span>
          </div>
        )}

        <div className="profile-grid">
          <section className="profile-card profile-account-card">
            <div className="profile-card-heading">
              <span className="profile-heading-icon">
                <UserRound size={19} />
              </span>
              <div>
                <h2>Informações da conta</h2>
                <p>Você pode alterar seu nome e sua foto de perfil. Os demais dados são informativos.</p>
              </div>
            </div>

            <form
              className="profile-form"
              onSubmit={(event) => {
                event.preventDefault()
                void profile.save()
              }}
            >
              {/* Seção de Foto do Perfil */}
              <div className="profile-avatar-section">
                <div className="profile-avatar-wrapper">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={`Foto de ${profile.name}`}
                      className="profile-avatar-img"
                    />
                  ) : (
                    <span className="profile-avatar-placeholder" aria-hidden="true">
                      <UserRound size={38} strokeWidth={1.75} />
                    </span>
                  )}
                </div>

                <div className="profile-avatar-controls">
                  <div className="profile-avatar-title">
                    <strong>Foto do perfil</strong>
                    <span>JPG, PNG ou WEBP até 5MB</span>
                  </div>

                  <div className="profile-avatar-buttons">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="profile-photo-input"
                      className="profile-file-input-hidden"
                      accept="image/png,image/jpeg,image/webp,image/jpg"
                      onChange={handleFileChange}
                    />
                    <button
                      type="button"
                      className="profile-avatar-btn profile-avatar-btn-upload"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera size={15} />
                      Alterar foto
                    </button>

                    {profile.avatarUrl && (
                      <button
                        type="button"
                        className="profile-avatar-btn profile-avatar-btn-remove"
                        onClick={profile.onRemoveAvatar}
                      >
                        <Trash2 size={15} />
                        Remover foto
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Campo Nome (Editável) */}
              <label className="profile-field-label">
                Nome completo
                <input
                  type="text"
                  value={profile.name}
                  onChange={(event) => profile.setName(event.currentTarget.value)}
                  autoComplete="name"
                  placeholder="Seu nome completo"
                />
              </label>

              {/* Informações da conta somente leitura */}
              <div className="profile-readonly-container">
                <span className="profile-readonly-heading">Dados cadastrais (somente leitura)</span>
                <div className="profile-readonly-grid">
                  <div>
                    <span>E-mail</span>
                    <strong>{profile.user.email}</strong>
                  </div>
                  <div>
                    <span>Status</span>
                    <strong className="profile-status-badge">{profile.user.status}</strong>
                  </div>
                  <div>
                    <span>Perfil de acesso</span>
                    <strong>{profile.user.role}</strong>
                  </div>
                  <div>
                    <span>Data de criação</span>
                    <strong>{new Date(profile.user.data_criacao).toLocaleDateString('pt-BR')}</strong>
                  </div>
                  <div>
                    <span>Identificador da conta</span>
                    <strong className="profile-mono-id">{profile.user.id}</strong>
                  </div>
                  <div>
                    <span>Perfil de permissão</span>
                    <strong>{profile.user.perfil_id}</strong>
                  </div>
                </div>
              </div>

              <div className="profile-actions">
                <button className="profile-cancel" type="button" onClick={profile.cancel}>
                  Cancelar
                </button>
                <button className="profile-save" type="submit" disabled={profile.isSaving}>
                  <Save size={16} />
                  {profile.isSaving ? 'Salvando...' : 'Salvar alterações'}
                </button>
              </div>
            </form>
          </section>

          {/* Informações do Vínculo Empregatício (Somente leitura para ler) */}
          {profile.colaborador && (
            <section className="profile-card profile-link-card">
              <div className="profile-card-heading">
                <span className="profile-heading-icon">
                  <BriefcaseBusiness size={19} />
                </span>
                <div>
                  <h2>Informações do vínculo</h2>
                  <p>Dados do vínculo empregatício na Fundação (somente leitura).</p>
                </div>
              </div>

              <div className="link-details">
                <div>
                  <span>Matrícula</span>
                  <strong>{profile.colaborador.matricula}</strong>
                </div>
                <div>
                  <span>Setor</span>
                  <strong>{profile.colaborador.setor}</strong>
                </div>
                <div>
                  <span>Cargo</span>
                  <strong>{profile.colaborador.cargo}</strong>
                </div>
                <div>
                  <span>Data de admissão</span>
                  <strong>
                    <CalendarDays size={14} />
                    {new Date(profile.colaborador.data_admissao).toLocaleDateString('pt-BR')}
                  </strong>
                </div>
                <div>
                  <span>Telefone</span>
                  <strong>
                    <Mail size={14} />
                    {profile.colaborador.telefone || 'Não informado'}
                  </strong>
                </div>
                <div>
                  <span>Status do vínculo</span>
                  <strong className="link-status">{profile.colaborador.status}</strong>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Modal de Confirmação de Saída com Alterações Não Salvas */}
      {profile.isConfirmDialogOpen && (
        <div
          className="profile-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-unsaved-title"
        >
          <div className="profile-modal-card">
            <div className="profile-modal-header">
              <span className="profile-modal-icon" aria-hidden="true">
                <AlertTriangle size={22} />
              </span>
              <div>
                <h3 id="profile-unsaved-title">Alterações não salvas</h3>
                <p>Você possui alterações não salvas. Deseja sair sem salvar?</p>
              </div>
            </div>
            <div className="profile-modal-actions">
              <button
                type="button"
                className="profile-modal-btn profile-modal-btn-secondary"
                onClick={profile.cancelLeave}
              >
                Continuar editando
              </button>
              <button
                type="button"
                className="profile-modal-btn profile-modal-btn-danger"
                onClick={profile.confirmLeaveWithoutSaving}
              >
                Sair sem salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
