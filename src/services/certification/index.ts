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

// Seeded from the "Recognitions" section on the website's About page.
export const useCertification = createContentCollection<Certification>('certifications', [
  {
    id: 'c1',
    title: 'Salesforce Consulting Partner',
    type: 'Certified Ecosystem Integration',
    description:
      'Delivering end-to-end strategy, customization, data migration, and Managed AppExchange integrations.',
    icon: 'zap',
    isActive: true,
  },
  {
    id: 'c2',
    title: 'Zoho Premium Partner',
    type: 'Official Deployment Expert',
    description:
      'Certified implementation and customization for Zoho Books, CRM, and custom low-code Creator Apps.',
    icon: 'check',
    isActive: true,
  },
  {
    id: 'c3',
    title: 'ISO/IEC 27001 Compliant',
    type: 'Information Security Standard',
    description:
      'Following strict data protection governance, access controls, and secure code engineering structures.',
    icon: 'shield',
    isActive: true,
  },
  {
    id: 'c4',
    title: 'Enterprise Delivery Quality',
    type: 'Acclaimed Best Practices',
    description:
      'Recognized for workflow excellence and reliable client project delivery timelines with 98% satisfaction.',
    icon: 'award',
    isActive: true,
  },
])
