import type { ComponentType, ReactNode } from 'react'

const TONE: Record<string, string> = {
  accent: 'bg-accent-bg text-accent',
  emerald: 'bg-emerald-500/10 text-emerald-500',
  amber: 'bg-amber-500/10 text-amber-500',
}

export type StatTone = 'accent' | 'emerald' | 'amber'

export function StatCard({
  icon: Icon,
  label,
  value,
  loading,
  tone = 'accent',
}: {
  icon: ComponentType<{ size?: number }>
  label: string
  value?: number
  loading: boolean
  tone?: StatTone
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${TONE[tone]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm text-body">{label}</p>
        {loading ? (
          <div className="mt-1 h-7 w-12 animate-pulse rounded bg-surface-2" />
        ) : (
          <p className="text-2xl font-semibold text-heading">{value ?? 0}</p>
        )}
      </div>
    </div>
  )
}

export function Panel({
  title,
  subtitle,
  action,
  className = '',
  children,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <section className={`rounded-xl border border-border bg-surface p-5 ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-heading">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-body">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="py-6 text-center text-sm text-body">{children}</p>
}
