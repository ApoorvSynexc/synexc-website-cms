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

// Seeded from the default FAQs in the website's faq.tsx (shown on the Industries page).
export const useFaq = createContentCollection<Faq>('faqs', [
  {
    id: 'f1',
    group: 'Industries',
    question: 'Which industries does Synexc specialize in?',
    answer:
      'We work with organizations across Healthcare, Manufacturing, Retail, BFSI, Real Estate, and IT, delivering industry-specific solutions built around their operational workflows, compliance requirements, and business objectives.',
    isActive: true,
  },
  {
    id: 'f2',
    group: 'Industries',
    question:
      'How does Synexc adapt its solutions for different industries rather than offering a one-size-fits-all approach?',
    answer:
      "Every engagement begins with understanding your industry's operating model, business processes, compliance requirements, and technology landscape. We tailor every solution to align with your operational priorities rather than relying on predefined templates.",
    isActive: true,
  },
  {
    id: 'f3',
    group: 'Industries',
    question: 'Can Synexc support businesses with operations across multiple locations or countries?',
    answer:
      'Yes. Our solutions are designed to support multi-location and global operations through scalable architectures, centralized data management, and integrations that provide consistent visibility across business units.',
    isActive: true,
  },
  {
    id: 'f4',
    group: 'Industries',
    question: 'How do you ensure technology solutions remain scalable as our business evolves?',
    answer:
      'We design solutions using scalable architectures and integration-first approaches that can support new business processes, users, locations, and technologies without requiring major platform overhauls.',
    isActive: true,
  },
  {
    id: 'f5',
    group: 'Industries',
    question: 'How much does an industry-specific service cost?',
    answer:
      'The cost depends on factors such as project scope, technology stack, integrations, customization requirements, and deployment model. After understanding your business objectives, we provide a tailored estimate and implementation roadmap aligned with your budget and priorities.',
    isActive: true,
  },
  {
    id: 'f6',
    group: 'General',
    question: 'What does Synexc actually do?',
    answer:
      'We help businesses modernize IT operations through CRM, automation, cloud systems, and AI-driven solutions across the globe.',
    isActive: true,
  },
  {
    id: 'f7',
    group: 'General',
    question: 'Do you only provide implementation or also consulting?',
    answer: 'We do both, right from strategy and system design to full implementation and ongoing support.',
    isActive: true,
  },
])
