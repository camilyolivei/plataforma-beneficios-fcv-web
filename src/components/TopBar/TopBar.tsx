import { Search, Bell } from 'lucide-react'
import { useHeaderViewModel } from '../../viewmodels/useHeaderViewModel'
import type { DashboardSection } from '../../viewmodels/useDashboardNavigationViewModel'
import { Logo } from '../Header/Logo'
import { UserMenu } from '../Header/UserMenu'
import './TopBar.css'

type TopBarProps = {
  activeSection: DashboardSection
  userName?: string
  userRole?: string
  onNavigate: (section: DashboardSection) => void
  onLogout?: () => void
}

export function TopBar({ activeSection, userName, userRole, onNavigate, onLogout }: TopBarProps) {
  const {
    query,
    setQuery,
    placeholder,
    searchResults,
    selectSearchResult,
    isNotificationsOpen,
    isUserMenuOpen,
    toggleNotifications,
    toggleUserMenu,
    closePopovers,
  } = useHeaderViewModel(activeSection, onNavigate)

  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && searchResults[0]) {
      event.preventDefault()
      selectSearchResult(searchResults[0].id)
    }

    if (event.key === 'Escape') setQuery('')
  }

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <Logo />
      </div>
      <div className="topbar-search">
        <span className="topbar-search__icon">
          <Search size={17} strokeWidth={2} />
        </span>
        <input
          className="topbar-search__input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder={placeholder}
          aria-label="Buscar módulos"
          aria-expanded={query.trim().length > 0}
          aria-controls="topbar-search-results"
        />
        {query.trim() && (
          <div className="topbar-search__results" id="topbar-search-results" role="listbox">
            {searchResults.length > 0 ? searchResults.map((result) => (
              <button
                className="topbar-search__result"
                key={result.id}
                type="button"
                role="option"
                aria-selected="false"
                onClick={() => selectSearchResult(result.id)}
              >
                <span>{result.title}</span>
                <span>{result.description}</span>
              </button>
            )) : (
              <p className="topbar-search__empty">Nenhum módulo encontrado.</p>
            )}
          </div>
        )}
      </div>

      <div
        className="topbar-actions"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            closePopovers()
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') closePopovers()
        }}
      >
        <div className="topbar-notification-area">
          <button
            className="topbar-bell"
            type="button"
            aria-label="Notificações"
            aria-expanded={isNotificationsOpen}
            onClick={toggleNotifications}
          >
            <Bell size={20} strokeWidth={1.8} />
            <span className="topbar-bell__badge" aria-hidden="true" />
          </button>
          {isNotificationsOpen && (
            <p className="topbar-notifications" role="status">Nenhuma notificação nova.</p>
          )}
        </div>

        <UserMenu
          name={userName}
          role={userRole}
          isOpen={isUserMenuOpen}
          onToggle={toggleUserMenu}
          onClose={closePopovers}
          onConfigureMenu={() => onNavigate('configuracoes')}
          onLogout={onLogout}
        />
      </div>
    </header>
  )
}
