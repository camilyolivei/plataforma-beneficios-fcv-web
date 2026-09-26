import { LogOut, Menu, Settings, UserRound } from 'lucide-react'
import { useEffect, useRef } from 'react'
import './Header.css'

type UserMenuProps = {
  name?: string
  role?: string
  avatarUrl?: string
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  onConfigureMenu?: () => void
  onLogout?: () => void
}

export function UserMenu({
  name = 'Nome do usuário',
  role = 'Conta FCV',
  avatarUrl,
  isOpen,
  onToggle,
  onClose,
  onConfigureMenu,
  onLogout,
}: UserMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    function closeOnOutsideClick(event: PointerEvent) {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [isOpen, onClose])

  function closeOnEscape(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      onClose()
      containerRef.current?.querySelector('button')?.focus()
    }
  }

  return (
    <div
      ref={containerRef}
      className="user-menu-container"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          onClose()
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
        onClick={onToggle}
      >
        {avatarUrl ? (
          <img className="user-menu__avatar" src={avatarUrl} alt="" />
        ) : (
          <span className="user-menu__avatar user-menu__avatar--placeholder" aria-hidden="true">
            <UserRound size={20} strokeWidth={1.75} />
          </span>
        )}
        <span className="user-menu__details">
          <span className="user-menu__name">{name}</span>
          <span className="user-menu__role">{role}</span>
        </span>
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
              <span className="user-menu__account-label">{role}</span>
            </span>
          </div>
          <div className="user-menu__divider" />
          <button
            className="user-menu__option"
            type="button"
            role="menuitem"
            onClick={() => {
              onConfigureMenu?.()
              onClose()
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
              onClose()
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