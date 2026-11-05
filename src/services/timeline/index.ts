import { createContentCollection } from '../website-content/collection'

export type TimelineEvent = {
  id: string
  /** Four-digit year, e.g. "2023". */
  year: string
  title: string
  description: string
  isActive: boolean
}

// Seeded from the milestones in the website's OurTimeline component.
export const useTimeline = createContentCollection<TimelineEvent>('timeline', [
  {
    id: 'm1',
    year: '2019',
    title: 'The Founding spark',
    description:
      'Synexc was founded in Noida, India, focusing initially on CRM consulting and implementation services for Salesforce and Zoho setups.',
    isActive: true,
  },
  {
    id: 'm2',
    year: '2021',
    title: 'Vertical Expansion',
    description:
      'We scaled our technical capabilities to include IT Service Management (ITSM ServiceNow) and custom full-stack web and mobile application engineering.',
    isActive: true,
  },
  {
    id: 'm3',
    year: '2023',
    title: 'Intelligent Automation & AI',
    description:
      'We launched our AI consulting and process automation services, helping clients structure business data and build intelligent operations workflows.',
    isActive: true,
  },
  {
    id: 'm4',
    year: '2026',
    title: 'Next-Gen Engineering & Global Reach',
    description:
      'Today, we support organizations globally with high-performance frameworks, Agentic AI pipelines, and digital strategy consulting.',
    isActive: true,
  },
])
