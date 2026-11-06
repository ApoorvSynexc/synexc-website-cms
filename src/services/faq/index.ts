import { createContentCollection } from '../website-content/collection'

/** Which website page / section the FAQ is shown on. */
export const FAQ_GROUPS = [
  'General',
  'Industries',
  'Salesforce',
  'Zoho',
  'HubSpot',
  'AWS',
  'Azure',
  'ITSM',
  'Managed IT',
  'AI & Automation',
  'App Development',
] as const

export type Faq = {
  id: string
  question: string
  answer: string
  group: string
  isActive: boolean
}

export const useFaq = createContentCollection<Faq>({ key: 'faqs', path: 'faq' })
