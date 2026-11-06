import type { ComponentType, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { FiBookOpen, FiCalendar, FiCheckCircle, FiEdit3, FiPlus } from 'react-icons/fi'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button, Typography } from '../../components'
import { useSession } from '../../hooks'
import { useBlogCategory, useBlogStats, type Blog } from '../../services'
import { formatDate } from '../../utils/date'

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#ef4444']
const AXIS_TICK = { fill: 'var(--text)', fontSize: 12 }
const TOOLTIP_STYLE = {
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  fontSize: 12,
  color: 'var(--text-h)',
}

export default function DashboardPage() {
  const { user } = useSession()
  const { data: stats, isLoading } = useBlogStats()
  const { getCategories } = useBlogCategory()
  const categories = getCategories.data ?? []
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? 'Uncategorised'

  const categoryData = [...(stats?.byCategory ?? [])]
    .sort((a, b) => b.count - a.count)
    .map((c) => ({ name: c.name, count: c.count }))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Typography variant="h5">Welcome back, {user?.name?.split(' ')[0] ?? 'there'}</Typography>
          <Typography variant="body-sm" color="body" className="mt-0.5">
            Here&apos;s what&apos;s happening with your blog content.
          </Typography>
        </div>
        <Link to="/blogs">
          <Button size="sm" leftIcon={<FiPlus size={16} />}>
            Manage Blogs
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FiBookOpen} label="Total blogs" value={stats?.total} loading={isLoading} />
        <StatCard
          icon={FiCheckCircle}
          label="Published"
          value={stats?.published}
          loading={isLoading}
          tone="emerald"
        />
        <StatCard
          icon={FiEdit3}
          label="Drafts"
          value={stats?.drafts}
          loading={isLoading}
          tone="amber"
        />
        <StatCard
          icon={FiCalendar}
          label="Published this month"
          value={stats?.publishedThisMonth}
          loading={isLoading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Panel title="Publishing activity" subtitle="Blogs published in the last 6 months" className="lg:col-span-3">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.byMonth ?? []} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={AXIS_TICK} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={AXIS_TICK} />
                <Tooltip
                  cursor={{ fill: 'var(--accent-bg)' }}
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={{ color: 'var(--text-h)' }}
                  formatter={(value) => [value, 'Published']}
                />
                <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Blogs by category" subtitle="All posts, including drafts" className="lg:col-span-2">
          {categoryData.length === 0 ? (
            <Empty>No blogs yet.</Empty>
          ) : (
            <>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="count"
                      nameKey="name"
                      innerRadius={46}
                      outerRadius={72}
                      paddingAngle={2}
                      stroke="var(--bg)"
                    >
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} itemStyle={{ color: 'var(--text-h)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-2 space-y-1.5">
                {categoryData.map((c, i) => (
                  <li key={c.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-heading">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                      {c.name}
                    </span>
                    <span className="text-body">{c.count}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Recent blogs" action={<SeeAll />}>
          <BlogList blogs={stats?.recent} loading={isLoading} categoryName={categoryName} showStatus />
        </Panel>
        <Panel title="Drafts to finish" action={<SeeAll />}>
          <BlogList
            blogs={stats?.drafted}
            loading={isLoading}
            categoryName={categoryName}
            emptyText="No drafts — everything is published."
          />
        </Panel>
      </div>
    </div>
  )
}

function SeeAll() {
  return (
    <Link to="/blogs" className="text-xs font-medium text-accent hover:underline">
      View all
    </Link>
  )
}

const TONE: Record<string, string> = {
  accent: 'bg-accent-bg text-accent',
  emerald: 'bg-emerald-500/10 text-emerald-500',
  amber: 'bg-amber-500/10 text-amber-500',
}

function StatCard({
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
  tone?: 'accent' | 'emerald' | 'amber'
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

function Panel({
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

function Empty({ children }: { children: ReactNode }) {
  return <p className="py-6 text-center text-sm text-body">{children}</p>
}

function BlogList({
  blogs,
  loading,
  categoryName,
  showStatus,
  emptyText = 'No blogs yet.',
}: {
  blogs?: Blog[]
  loading: boolean
  categoryName: (id: string) => string
  showStatus?: boolean
  emptyText?: string
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-10 animate-pulse rounded bg-surface-2" />
        ))}
      </div>
    )
  }
  if (!blogs?.length) return <Empty>{emptyText}</Empty>

  return (
    <ul className="divide-y divide-border">
      {blogs.map((b) => (
        <li key={b.id} className="flex items-center justify-between gap-3 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-heading">{b.title}</p>
            <p className="truncate text-xs text-body">
              {categoryName(b.categoryId)} · {b.author} · {formatDate(b.publishedAt)}
            </p>
          </div>
          {showStatus && (
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                b.publishStatus === 'PUBLISHED'
                  ? 'bg-emerald-500/10 text-emerald-600'
                  : 'bg-amber-500/10 text-amber-600'
              }`}
            >
              {b.publishStatus === 'PUBLISHED' ? 'Published' : 'Draft'}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}
