import { createContentCollection } from '../website-content/collection'

/** Badge icons the website can render for a certification card. */
export const CERTIFICATION_ICONS = [
  { value: 'zap', label: 'Lightning (partner)' },
  { value: 'check', label: 'Check circle' },
  { value: 'shield', label: 'Shield (security)' },
  { value: 'award', label: 'Award' },
] as const

export type Certification = {
  id: string
  title: string
  /** Sub-heading under the title, e.g. "Certified Ecosystem Integration". */
  type: string
  description: string
  icon: string
  isActive: boolean
}

export const useCertification = createContentCollection<Certification>({
  key: 'certifications',
  path: 'certification',
})
