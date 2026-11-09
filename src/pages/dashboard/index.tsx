import type { ComponentType } from 'react'
import { Link } from 'react-router-dom'
import {
  FiAward,
  FiBarChart2,
  FiBell,
  FiBookOpen,
  FiCamera,
  FiClock,
  FiFileText,
  FiHelpCircle,
  FiImage,
  FiAlertCircle,
  FiLayers,
  FiMessageSquare,
  FiPlus,
  FiShield,
  FiUsers,
} from 'react-icons/fi'
import { Empty, Panel, Typography } from '../../components'
import { useSession } from '../../hooks'
import { useDashboard, type DashboardOverview } from '../../services'
import { formatDate } from '../../utils/date'

type Icon = ComponentType<{ size?: number }>
type Tone = 'emerald' | 'amber' | 'accent' | 'muted'
type Row = [label: string, value: number, tone: Tone]

/** Website-content lists: label, icon and the page each one lives on. */
const CONTENT: Record<string, { label: string; icon: Icon; to: string }> = {
  hero_slide: { label: 'Hero slides', icon: FiLayers, to: '/website-content/hero-slide' },
  testimonial: { label: 'Testimonials', icon: FiMessageSquare, to: '/website-content/testimonial' },
  faq: { label: 'FAQs', icon: FiHelpCircle, to: '/website-content/faq' },
  partner_logo: { label: 'Partner logos', icon: FiImage, to: '/website-content/partner-logo' },
  team_member: { label: 'Leadership', icon: FiUsers, to: '/website-content/leadership' },
  timeline_event: { label: 'Timeline events', icon: FiClock, to: '/website-content/timeline' },
  certification: { label: 'Certifications', icon: FiAward, to: '/website-content/certification' },
  key_stat: { label: 'Key stats', icon: FiBarChart2, to: '/website-content/key-stat' },
  gallery_image: { label: 'Gallery photos', icon: FiCamera, to: '/website-content/gallery' },
}

const RECENT_TYPE = {
  blog: { label: 'Blog', to: '/blogs' },
  case_study: { label: 'Case study', to: '/case-studies' },
}

const DOT: Record<Tone, string> = {
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  accent: 'bg-accent',
  muted: 'bg-border',
}

export default function DashboardPage() {
  const { user, can } = useSession()
  const { data, isLoading } = useDashboard()
  const content = data?.content ?? []
  const actions = [
    { label: 'New blog', to: '/blogs?new=1', show: can('blog', 'create') },
    { label: 'New case study', to: '/case-studies?new=1', show: can('case_study', 'create') },
    { label: 'New announcement', to: '/announcements?new=1', show: can('announcement', 'create') },
  ].filter((a) => a.show)

  const attention: { text: string; to: string }[] = []
  const stale = data?.attention?.staleDrafts
  if (stale?.blogs) attention.push({ text: `${stale.blogs} blog draft${stale.blogs > 1 ? 's' : ''} untouched for over 2 weeks`, to: '/blogs' })
  if (stale?.caseStudies) {
    attention.push({ text: `${stale.caseStudies} case study draft${stale.caseStudies > 1 ? 's' : ''} untouched for over 2 weeks`, to: '/case-studies' })
  }
  for (const a of data?.attention?.endingSoon ?? []) {
    attention.push({ text: `Announcement “${a.title}” ends ${formatDate(a.endDate)}`, to: '/announcements' })
  }
  if (data?.users?.locked) {
    attention.push({ text: `${data.users.locked} user account${data.users.locked > 1 ? 's are' : ' is'} locked`, to: '/access-control' })
  }

  const empty = !isLoading && data && !data.blog && !data.caseStudy && !data.announcement && !data.users && !content.length

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Typography variant="h5">Welcome back, {user?.name?.split(' ')[0] ?? 'there'}</Typography>
        <Typography variant="body-sm" color="body" className="mt-0.5">
          A quick look at everything you manage on the Synexc website.
        </Typography>
      </div>

      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {actions.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
            >
              <FiPlus size={15} />
              {a.label}
            </Link>
          ))}
        </div>
      )}

      {attention.length > 0 && (
        <Panel title="Needs attention" subtitle="Things worth a look today">
          <ul className="divide-y divide-border">
            {attention.map((item) => (
              <li key={item.text}>
                <Link to={item.to} className="flex items-center gap-3 py-2.5 text-sm text-heading hover:text-accent">
                  <FiAlertCircle size={16} className="shrink-0 text-amber-500" />
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl border border-border bg-surface" />
          ))}
        </div>
      )}

      {empty && (
        <Panel title="Nothing to show yet">
          <Empty>Your role does not include any modules with numbers to display.</Empty>
        </Panel>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data?.blog && (
          <ModuleCard
            icon={FiBookOpen}
            title="Blogs"
            to="/blogs"
            headline={data.blog.total}
            unit="posts"
            rows={[
              ['Published', data.blog.published, 'emerald'],
              ['Drafts', data.blog.drafts, 'amber'],
            ]}
          />
        )}
        {data?.caseStudy && (
          <ModuleCard
            icon={FiFileText}
            title="Case studies"
            to="/case-studies"
            headline={data.caseStudy.total}
            unit="studies"
            rows={[
              ['Published', data.caseStudy.published, 'emerald'],
              ['Drafts', data.caseStudy.drafts, 'amber'],
            ]}
          />
        )}
        {data?.announcement && (
          <ModuleCard
            icon={FiBell}
            title="Announcements"
            to="/announcements"
            headline={data.announcement.live}
            unit="live now"
            rows={[
              ['Upcoming', data.announcement.upcoming, 'accent'],
              ['Ended / off', data.announcement.ended, 'muted'],
            ]}
          />
        )}
        {data?.users && (
          <ModuleCard
            icon={FiShield}
            title="Users"
            to="/access-control"
            headline={data.users.total}
            unit="users"
            rows={[
              ['Active', data.users.active, 'emerald'],
              ['Locked', data.users.locked, data.users.locked > 0 ? 'amber' : 'muted'],
              ...(data.roles ? [['Roles', data.roles.total, 'accent'] as Row] : []),
            ]}
          />
        )}
      </div>

      {content.length > 0 && (
        <Panel title="Website content" subtitle="Items shown on the website, out of all items">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {content.map((c) => {
              const meta = CONTENT[c.subject]
              if (!meta) return null
              const IconComponent = meta.icon
              return (
                <Link
                  key={c.subject}
                  to={meta.to}
                  className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-surface-2"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-bg text-accent">
                    <IconComponent size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-heading">{meta.label}</span>
                    <span className="text-xs text-body">
                      <b className="font-semibold text-heading">{c.visible}</b> of {c.total} visible
                    </span>
                  </span>
                </Link>
              )
            })}
          </div>
        </Panel>
      )}

      {data && (data.blog || data.caseStudy) && (
        <Panel title="Recent activity" subtitle="Latest blogs and case studies">
          <RecentList items={data.recent} />
        </Panel>
      )}
    </div>
  )
}

function ModuleCard({
  icon: IconComponent,
  title,
  to,
  headline,
  unit,
  rows,
}: {
  icon: Icon
  title: string
  to: string
  headline: number
  unit: string
  rows: Row[]
}) {
  return (
    <Link to={to} className="rounded-xl border border-border bg-surface p-5 transition-colors hover:bg-surface-2">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-bg text-accent">
          <IconComponent size={19} />
        </span>
        <h3 className="text-sm font-semibold text-heading">{title}</h3>
      </div>
      <p className="mt-4 text-3xl font-semibold text-heading">
        {headline} <span className="text-sm font-normal text-body">{unit}</span>
      </p>
      <ul className="mt-3 space-y-1.5">
        {rows.map(([label, value, tone]) => (
          <li key={label} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-body">
              <span className={`h-2 w-2 rounded-full ${DOT[tone]}`} />
              {label}
            </span>
            <span className="font-medium text-heading">{value}</span>
          </li>
        ))}
      </ul>
    </Link>
  )
}

function RecentList({ items }: { items: DashboardOverview['recent'] }) {
  if (!items.length) return <Empty>Nothing published or drafted yet.</Empty>
  return (
    <ul className="divide-y divide-border">
      {items.map((item) => (
        <li key={`${item.type}-${item.id}`}>
          <Link to={RECENT_TYPE[item.type].to} className="flex items-center justify-between gap-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-heading">{item.title}</p>
              <p className="text-xs text-body">
                {RECENT_TYPE[item.type].label} · {formatDate(item.date)}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                item.publishStatus === 'PUBLISHED'
                  ? 'bg-emerald-500/10 text-emerald-600'
                  : 'bg-amber-500/10 text-amber-600'
              }`}
            >
              {item.publishStatus === 'PUBLISHED' ? 'Published' : 'Draft'}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
