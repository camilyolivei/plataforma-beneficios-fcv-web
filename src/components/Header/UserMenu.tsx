import { LogOut, Menu, Settings, UserRound } from 'lucide-react'
import { useRef, useState } from 'react'

type UserMenuProps = {
  name?: string
  avatarUrl?: string
  onConfigureMenu?: () => void
  onLogout?: () => void
}

export function UserMenu({
  name = 'Nome do usuário',
  avatarUrl,
  onConfigureMenu,
  onLogout,
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  function closeOnEscape(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      setIsOpen(false)
      containerRef.current?.querySelector('button')?.focus()
    }
  }

  return (
    <div
      ref={containerRef}
      className="user-menu-container"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsOpen(false)
        }
      }}
      onKeyDown={closeOnEscape}
    >
      <button
        className="user-menu"
        type="button"
        aria-label={`Menu do usuário: ${name}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {avatarUrl ? (
          <img className="user-menu__avatar" src={avatarUrl} alt="" />
        ) : (
          <span className="user-menu__avatar user-menu__avatar--placeholder" aria-hidden="true">
            <UserRound size={20} strokeWidth={1.75} />
          </span>
        )}
        <span className="user-menu__name">{name}</span>
        <span className="user-menu__chevron" aria-hidden="true" />
        <span className="user-menu__mobile-icon" aria-hidden="true">
          <Menu size={22} strokeWidth={1.8} />
        </span>
      </button>

      {isOpen && (
        <div className="user-menu__dropdown" role="menu" aria-label="Opções do usuário">
          <div className="user-menu__account" role="group" aria-label={`Conta de ${name}`}>
            {avatarUrl ? (
              <img className="user-menu__account-avatar" src={avatarUrl} alt="" />
            ) : (
              <span className="user-menu__account-avatar user-menu__account-placeholder" aria-hidden="true">
                <UserRound size={18} strokeWidth={1.75} />
              </span>
            )}
            <span className="user-menu__account-details">
              <span className="user-menu__account-name">{name}</span>
              <span className="user-menu__account-label">Conta FCV</span>
            </span>
          </div>
          <div className="user-menu__divider" />
          <button
            className="user-menu__option"
            type="button"
            role="menuitem"
            onClick={() => {
              onConfigureMenu?.()
              setIsOpen(false)
            }}
          >
            <span className="user-menu__option-icon" aria-hidden="true">
              <Settings size={17} />
            </span>
            <span>Configurar menu</span>
          </button>
          <button
            className="user-menu__option user-menu__option--logout"
            type="button"
            role="menuitem"
            onClick={() => {
              onLogout?.()
              setIsOpen(false)
            }}
          >
            <span className="user-menu__option-icon" aria-hidden="true">
              <LogOut size={17} />
            </span>
            <span>Sair</span>
          </button>
        </div>
      )}
    </div>
  )
}