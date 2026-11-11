import type { ComponentType } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  FiAward,
  FiCamera,
  FiHelpCircle,
  FiImage,
  FiMessageSquare,
} from 'react-icons/fi'
import { SectionLayout } from '../../components'
import { useSession } from '../../hooks'
import Testimonial from './testimonial'
import Faq from './faq'
import PartnerLogo from './partner-logo'
import Certification from './certification'
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
  { key: 'testimonial', label: 'Testimonials', icon: FiMessageSquare, component: Testimonial, subject: 'testimonial' },
  { key: 'faq', label: 'FAQs', icon: FiHelpCircle, component: Faq, subject: 'faq' },
  { key: 'partner-logo', label: 'Partner Logos', icon: FiImage, component: PartnerLogo, subject: 'partner_logo' },
  { key: 'certification', label: 'Certifications', icon: FiAward, component: Certification, subject: 'certification' },
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
      description="Edit the quotes, FAQs, logos and photos that appear across the website."
      items={visible}
      active={active.key}
      onSelect={(key) => navigate(`/website-content/${key}`)}
    >
      <ActiveModule />
    </SectionLayout>
  )
}
