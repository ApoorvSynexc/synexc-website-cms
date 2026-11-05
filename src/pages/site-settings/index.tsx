import type { ComponentType } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { FiGlobe, FiSearch } from 'react-icons/fi'
import { SectionLayout } from '../../components'
import { useSession } from '../../hooks'
import General from './general'
import Seo from './seo'

type ModuleItem = {
  key: string
  label: string
  icon: ComponentType<{ size?: number }>
  component: ComponentType
  subject: string
}

const MODULES: ModuleItem[] = [
  { key: 'general', label: 'General', icon: FiGlobe, component: General, subject: 'site_settings' },
  { key: 'seo', label: 'Page SEO', icon: FiSearch, component: Seo, subject: 'seo_page' },
]

export default function SiteSettingsPage() {
  const { module } = useParams<{ module: string }>()
  const navigate = useNavigate()
  const { can } = useSession()

  const visible = MODULES.filter((m) => can(m.subject, 'read'))
  const active = visible.find((m) => m.key === module)

  if (!active) {
    return <Navigate to={visible.length > 0 ? `/site-settings/${visible[0].key}` : '/'} replace />
  }

  const ActiveModule = active.component

  return (
    <SectionLayout
      title="Site Settings"
      description="Company details and search-engine information for the whole website."
      items={visible}
      active={active.key}
      onSelect={(key) => navigate(`/site-settings/${key}`)}
    >
      <ActiveModule />
    </SectionLayout>
  )
}
