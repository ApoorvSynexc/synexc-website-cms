import type { ComponentType } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  FiAward,
  FiBarChart2,
  FiCamera,
  FiClock,
  FiHelpCircle,
  FiImage,
  FiLayers,
  FiMessageSquare,
  FiUsers,
} from 'react-icons/fi'
import { SectionLayout } from '../../components'
import { useSession } from '../../hooks'
import Testimonial from './testimonial'
import HeroSlide from './hero-slide'
import Faq from './faq'
import PartnerLogo from './partner-logo'
import Leadership from './leadership'
import Timeline from './timeline'
import Certification from './certification'
import KeyStat from './key-stat'
import Gallery from './gallery'

type ModuleItem = {
  key: string
  label: string
  icon: ComponentType<{ size?: number }>
  component: ComponentType
  /** Permission subject needed to see this module (action: read). */
  subject: string
}

const MODULES: ModuleItem[] = [
  { key: 'hero-slide', label: 'Hero Slides', icon: FiLayers, component: HeroSlide, subject: 'hero_slide' },
  { key: 'testimonial', label: 'Testimonials', icon: FiMessageSquare, component: Testimonial, subject: 'testimonial' },
  { key: 'faq', label: 'FAQs', icon: FiHelpCircle, component: Faq, subject: 'faq' },
  { key: 'partner-logo', label: 'Partner Logos', icon: FiImage, component: PartnerLogo, subject: 'partner_logo' },
  { key: 'leadership', label: 'Leadership', icon: FiUsers, component: Leadership, subject: 'team_member' },
  { key: 'timeline', label: 'Company Timeline', icon: FiClock, component: Timeline, subject: 'timeline_event' },
  { key: 'certification', label: 'Certifications', icon: FiAward, component: Certification, subject: 'certification' },
  { key: 'key-stat', label: 'Key Stats', icon: FiBarChart2, component: KeyStat, subject: 'key_stat' },
  { key: 'gallery', label: 'Photo Gallery', icon: FiCamera, component: Gallery, subject: 'gallery_image' },
]

export default function WebsiteContentPage() {
  const { module } = useParams<{ module: string }>()
  const navigate = useNavigate()
  const { can } = useSession()

  const visible = MODULES.filter((m) => can(m.subject, 'read'))
  const active = visible.find((m) => m.key === module)

  if (!active) {
    return <Navigate to={visible.length > 0 ? `/website-content/${visible[0].key}` : '/'} replace />
  }

  const ActiveModule = active.component

  return (
    <SectionLayout
      title="Website Content"
      description="Edit the sliders, quotes, FAQs and logos that appear across the website."
      items={visible}
      active={active.key}
      onSelect={(key) => navigate(`/website-content/${key}`)}
    >
      <ActiveModule />
    </SectionLayout>
  )
}
