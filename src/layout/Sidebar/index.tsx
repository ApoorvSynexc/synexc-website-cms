import { NavLink } from 'react-router-dom'
import { useSession } from '../../hooks'
import { useInquiryCounts } from '../../services'
import type { ComponentType } from 'react'
import { FiBell, FiBookOpen, FiLayout, FiChevronLeft, FiChevronRight, FiFileText, FiHome, FiInbox, FiSettings, FiShield } from 'react-icons/fi'

type NavItem = {
  label: string
  icon: ComponentType<{ size?: number }>
  /** Omit for nav items that don't have a page yet. */
  to?: string
  /** Shown only if the user has at least one of these [subject, action] permissions. */
  anyOf?: [string, string][]
  /** Show the count of new inquiries on this item. */
  showNewInquiries?: boolean
}

const MAIN_NAV: NavItem[] = [
  { label: 'Dashboard', icon: FiHome, to: '/dashboard', anyOf: [['dashboard', 'read']] },
  { label: 'Blogs', icon: FiBookOpen, to: '/blogs', anyOf: [['blog', 'read']] },
  { label: 'Case Studies', icon: FiFileText, to: '/case-studies', anyOf: [['case_study', 'read']] },
  { label: 'Announcements', icon: FiBell, to: '/announcements', anyOf: [['announcement', 'read']] },
  { label: 'Inquiries', icon: FiInbox, to: '/inquiries', anyOf: [['inquiry', 'read']], showNewInquiries: true },
  {
    label: 'Website Content',
    icon: FiLayout,
    to: '/website-content',
    anyOf: [
      ['hero_slide', 'read'],
      ['testimonial', 'read'],
      ['faq', 'read'],
      ['partner_logo', 'read'],
      ['team_member', 'read'],
      ['timeline_event', 'read'],
      ['certification', 'read'],
      ['key_stat', 'read'],
      ['gallery_image', 'read'],
    ],
  },
  {
    label: 'Site Settings',
    icon: FiSettings,
    to: '/site-settings',
    anyOf: [['site_settings', 'read']],
  },
  {
    label: 'Access Control',
    icon: FiShield,
    to: '/access-control',
    anyOf: [['user', 'read'], ['role', 'read'], ['role_permission', 'read']],
  },
]

type SidebarProps = {
  collapsed: boolean
  onToggleCollapsed: () => void
}

export function Sidebar({ collapsed, onToggleCollapsed }: SidebarProps) {
  const { can } = useSession()
  const { data: counts } = useInquiryCounts(can('inquiry', 'read'))
  const items = MAIN_NAV.filter((item) => !item.anyOf || item.anyOf.some(([s, a]) => can(s, a)))

  return (
    <aside
      className={`relative flex shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      <div className="flex h-16 items-center gap-2.5 px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-fg">
          S
        </div>
        {!collapsed && (
          <span className="truncate text-base font-semibold text-heading">Synexc CMS</span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.label}>
              <NavItemLink
                item={item}
                collapsed={collapsed}
                badge={item.showNewInquiries && counts?.NEW ? counts.NEW : undefined}
              />
            </li>
          ))}
        </ul>
      </nav>

      <button
        type="button"
        onClick={onToggleCollapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-5 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-body shadow-sm transition-colors hover:text-heading"
      >
        {collapsed ? <FiChevronRight size={14} /> : <FiChevronLeft size={14} />}
      </button>
    </aside>
  )
}

function NavItemLink({
  item,
  collapsed,
  badge,
}: {
  item: NavItem
  collapsed: boolean
  badge?: number
}) {
  const Icon = item.icon

  if (!item.to) {
    return (
      <span
        title="Coming soon"
        className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-body/50"
      >
        <Icon size={18} />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </span>
    )
  }

  return (
    <NavLink
      to={item.to}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActive ? 'bg-accent text-accent-fg' : 'text-body hover:bg-surface-2 hover:text-heading'
        }`
      }
    >
      <Icon size={18} />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {badge !== undefined && (
        <span
          className={`flex items-center justify-center rounded-full bg-red-500 text-white ${
            collapsed
              ? 'absolute -right-1 -top-1 h-4 min-w-4 px-1 text-[10px]'
              : 'ml-auto h-5 min-w-5 px-1.5 text-[11px] font-semibold'
          }`}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </NavLink>
  )
}
