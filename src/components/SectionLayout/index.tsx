import type { ComponentType, ReactNode } from 'react'
import { Typography } from '../Typography'

export type SectionLayoutItem = {
  key: string
  label: string
  icon: ComponentType<{ size?: number }>
}

type SectionLayoutProps = {
  title: string
  description: string
  items: SectionLayoutItem[]
  active: string
  onSelect: (key: string) => void
  children: ReactNode
}

/** Page title, a left sub-menu and a white content panel — as on HRM's Configuration page. */
export function SectionLayout({
  title,
  description,
  items,
  active,
  onSelect,
  children,
}: SectionLayoutProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="shrink-0">
        <Typography variant="h5">{title}</Typography>
        <Typography variant="body-sm" color="body" className="mt-0.5">
          {description}
        </Typography>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
        <aside className="shrink-0 overflow-y-auto rounded-xl border border-border bg-surface p-3 lg:w-60">
          <ul className="space-y-0.5">
            {items.map((item) => {
              const Icon = item.icon
              const isActive = item.key === active
              return (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => onSelect(item.key)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-accent text-accent-fg'
                        : 'text-body hover:bg-surface-2 hover:text-heading'
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>

        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto rounded-xl border border-border bg-surface p-5">
          {children}
        </div>
      </div>
    </div>
  )
}
