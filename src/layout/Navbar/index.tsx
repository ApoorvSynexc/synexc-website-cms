import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FiChevronDown } from 'react-icons/fi'
import { Avatar } from '../../components'
import { useSession } from '../../hooks'
import { useAuth } from '../../services'
import { UserMenu } from './UserMenu'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/blogs': 'Blogs',
  '/case-studies': 'Case Studies',
  '/announcements': 'Announcements',
  '/profile': 'My Profile',
}

export function Navbar() {
  const { user } = useSession()
  const { logout } = useAuth()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const fullName = user?.name
  const pageTitle = pathname.startsWith('/site-settings')
    ? 'Site Settings'
    : pathname.startsWith('/website-content')
    ? 'Website Content'
    : pathname.startsWith('/access-control')
    ? 'Access Control'
    : (PAGE_TITLES[pathname] ?? 'Dashboard')

  return (
    <header className="flex h-16 items-center gap-6 border-b border-border bg-surface px-6">
      <nav aria-label="Breadcrumb" className="hidden shrink-0 items-center gap-1.5 text-sm md:flex">
        <span className="text-body">Home</span>
        <span className="text-body">/</span>
        <span className="font-medium text-heading">{pageTitle}</span>
      </nav>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg py-1.5 pr-2 pl-1.5 transition-colors hover:bg-surface-2"
          >
            <Avatar name={fullName} src={user?.avatar?.thumbnailUrl ?? user?.avatar?.url} size="sm" />
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-medium text-heading">{fullName}</span>
              <span className="block text-xs text-body">{user?.email}</span>
            </span>
            <FiChevronDown size={14} className="text-body" />
          </button>

          {menuOpen && (
            <>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-10 cursor-default"
              />
              <UserMenu
                user={user}
                fullName={fullName}
                onClose={() => setMenuOpen(false)}
                onSignOut={() => logout.mutate()}
                signingOut={logout.isPending}
              />
            </>
          )}
        </div>
      </div>
    </header>
  )
}
