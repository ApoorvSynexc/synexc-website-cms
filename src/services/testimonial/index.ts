import { createContentCollection } from '../website-content/collection'

/** Website pages a testimonial can appear on. */
export const TESTIMONIAL_PAGES = [
  { value: 'home', label: 'Home' },
  { value: 'about', label: 'About us' },
  { value: 'culture', label: 'Culture' },
  { value: 'case-studies', label: 'Case studies' },
  { value: 'industries', label: 'Industries' },
] as const

export type Testimonial = {
  id: string
  name: string
  /** e.g. "CEO, TechFlow Solutions" or just the company. */
  role: string
  message: string
  /** Client logo / photo: http(s) URL or a site path. */
  avatar: string
  pages: string[]
  isActive: boolean
}

// Seeded from the testimonials currently hardcoded across the website pages.
export const useTestimonial = createContentCollection<Testimonial>('testimonials', [
  {
    id: 't1',
    name: 'Mark Thompson',
    role: 'CEO, TechFlow Solutions',
    message:
      "Synexc transformed our CRM processes with their Salesforce expertise. Their team's deep technical knowledge and strategic approach were instrumental in our digital transformation journey. Highly recommended for any enterprise looking to scale.",
    avatar: '/client-logo/techflow_logo.png',
    pages: ['about', 'culture'],
    isActive: true,
  },
  {
    id: 't2',
    name: 'Sarah Jenkins',
    role: 'CTO, CloudScale Inc.',
    message:
      'The team at Synexc is professional and highly skilled. They delivered our complex AI integration project on time and within budget. Their commitment to quality and customer success is truly exceptional.',
    avatar: '/client-logo/cloudscale_logo.png',
    pages: ['about', 'culture'],
    isActive: true,
  },
  {
    id: 't3',
    name: 'David Lawson',
    role: 'Founder, Innovate Digital',
    message:
      'Great experience working with Synexc. Their AI-powered automation solutions have significantly improved our operational efficiency. They are not just service providers, but true strategic partners.',
    avatar: '/client-logo/innovatedigital_logo.png',
    pages: ['about', 'culture'],
    isActive: true,
  },
  {
    id: 't4',
    name: 'Takwi Leonard',
    role: 'WIMA',
    message: 'Smooth collaboration with Synexc. The team is responsive, skilled, and result-oriented.',
    avatar: '/home-page/first-review.png',
    pages: ['case-studies'],
    isActive: true,
  },
  {
    id: 't5',
    name: 'Project Head',
    role: 'Art of Living',
    message: 'The system brought structure and visibility we were missing for years. Thanks, Synexc!',
    avatar: '/home-page/second-review.png',
    pages: ['case-studies'],
    isActive: true,
  },
  {
    id: 't6',
    name: 'Gregg Jones',
    role: 'SmartMist Systems Ltd.',
    message:
      'Our sales process feels controlled and measurable. We now have clearer visibility, stronger accountability, and far more confidence in our pipeline.',
    avatar: '/home-page/third-review.png',
    pages: ['case-studies'],
    isActive: true,
  },
])
