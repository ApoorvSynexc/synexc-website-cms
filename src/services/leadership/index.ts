import { createContentCollection } from '../website-content/collection'

export type TeamMember = {
  id: string
  name: string
  role: string
  bio: string
  /** Optional photo: http(s) URL or a site path. Without one the site shows the initial. */
  photo: string
  linkedin: string
  email: string
  isActive: boolean
}

// Seeded from the leadership list in the website's Leadership component.
export const useLeadership = createContentCollection<TeamMember>('leadership', [
  {
    id: 'l1',
    name: 'Rohit Sharma',
    role: 'Founder & CEO',
    bio: "Rohit leads Synexc's strategic direction, focusing on enterprise client relations and scaling our global operations with a technology-first approach.",
    photo: '',
    linkedin: '',
    email: 'contact@synexc.com',
    isActive: true,
  },
  {
    id: 'l2',
    name: 'Karan Verma',
    role: 'Chief Technology Officer',
    bio: 'Karan heads our engineering team, overseeing core architecture designs, custom software systems, and intelligent agentic AI integrations.',
    photo: '',
    linkedin: '',
    email: 'contact@synexc.com',
    isActive: true,
  },
  {
    id: 'l3',
    name: 'Anjali Gupta',
    role: 'Head of Client Success',
    bio: 'Anjali manages client onboarding and service delivery operations, ensuring our CRM configurations align with target business metrics.',
    photo: '',
    linkedin: '',
    email: 'contact@synexc.com',
    isActive: true,
  },
])
