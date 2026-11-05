import { createContentCollection } from '../website-content/collection'

export type HeroSlide = {
  id: string
  category: string
  title: string
  description: string
  /** Banner image: http(s) URL or a site path. */
  image: string
  /** Optional partner logo shown on the slide. */
  logo: string
  /** Optional page the slide links to. */
  link: string
  isActive: boolean
}

// Seeded from `newsSlides` in the website's home hero slider.
export const useHeroSlide = createContentCollection<HeroSlide>('hero-slides', [
  {
    id: 'h1',
    category: 'CRM Consulting Services',
    title: 'AI-First IT Consulting Partner for Modern CRM Systems',
    description:
      'The foundation for modern CRM is built on data and AI. Discover AI-first CRM consulting services @Synexc.',
    image: '/banners/banner-crm.jpg',
    logo: '',
    link: '',
    isActive: true,
  },
  {
    id: 'h2',
    category: 'AI & Intelligent Automation Services',
    title: 'Salesforce Multi-Cloud Expertise',
    description: 'Agentforce, Zia, Custom AI',
    image: '/banners/banner-salesforce.jpg',
    logo: '/client-logo/partner-salesforce-logo.png',
    link: '',
    isActive: true,
  },
  {
    id: 'h3',
    category: 'Software Development Services',
    title: 'Custom Software Development',
    description: 'AppExchange Apps, React Node.js, REST APIs, Microservices',
    image: '/banners/banner-zoho.jpg',
    logo: '',
    link: '',
    isActive: true,
  },
  {
    id: 'h4',
    category: 'IT Staff Augmentation Services',
    title: 'IT Staff Augmentation Services',
    description: 'Salesforce, AI/ML, Full-Stack, Cloud, DevOps, QA, ServiceNow',
    image: '/banners/banner-staff.jpg',
    logo: '',
    link: '',
    isActive: true,
  },
  {
    id: 'h5',
    category: 'ITSM Consulting',
    title: 'ServiceNow Workflow Optimization',
    description: 'ServiceNow, Salesforce',
    image: '/banners/banner-servicenow.jpg',
    logo: '',
    link: '',
    isActive: true,
  },
  {
    id: 'h6',
    category: 'Cloud Consulting & Infrastructure Services',
    title: 'Cloud Consulting & Infrastructure Services',
    description: 'AWS, Azure, GCP',
    image: '/banners/banner-ai.jpg',
    logo: '',
    link: '',
    isActive: true,
  },
])
