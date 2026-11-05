import dayjs from 'dayjs'
import type { CaseStudy } from './types'

const body = (title: string) =>
  `<h2>Overview</h2><p>${title}</p><h2>The Challenge</h2><p>Describe the client problem here.</p><h2>The Solution</h2><p>Describe what Synexc built.</p>`

// slug, title, client, category, readTime, days ago
const ROWS: [string, string, string, string, string, number][] = [
  ['nigeria-agriculture-zoho', 'End-to-End Zoho Implementation & Integration for a Nigeria-Based Agriculture Firm', 'WIMA', 'CRM', '5 min read', 12],
  ['stripe-zoho-books-integration', 'Automating Stripe–Zoho Books Integration for a Canada-Based SaaS Company', 'Veriport', 'CRM', '6 min read', 17],
  ['advanced-zoho-customization', 'Advanced Zoho Customization for SmartMist Systems', 'SmartMist Systems Ltd.', 'CRM', '7 min read', 22],
  ['qr-attendance-system-art-of-living', 'Building a Slot-Controlled QR Attendance System for Art of Living Programs', 'Art of Living', 'Software Development', '5 min read', 25],
  ['ai-document-automation-pleerity', 'Developing a Payment-Gated AI Document Automation Platform for a UK Compliance Firm', 'Pleerity', 'AI & Automation', '7 min read', 29],
  ['zoho-projects-margin-intelligence', 'Improving Project Margin and Risk Visibility on Zoho One for a European Consulting Firm', 'Mario', 'Cloud', '6 min read', 32],
  ['custom-hrms-art-of-living', 'Designing a Centralized HRMS for Complete Applicant Lifecycle and Operational Governance', 'Art of Living HR', 'Software Development', '8 min read', 36],
]

export const SEED_CASE_STUDIES: CaseStudy[] = ROWS.map(
  ([slug, title, client, category, readTime, daysAgo], i) => {
    const publishedAt = dayjs().subtract(daysAgo, 'day').format('YYYY-MM-DD')
    return {
      id: `cs${i + 1}`,
      slug,
      title,
      client,
      category,
      description: `${title}.`,
      image: '',
      content: body(title),
      tags: [],
      // Only the first study's figures come from the live website; the team fills in the rest.
      results:
        i === 0
          ? [
              { metric: '100%', label: 'Duplicate-Free Records' },
              { metric: '81%', label: 'Lead Capture Increase' },
              { metric: '57%', label: 'Faster Billing Process' },
            ]
          : [],
      readTime,
      status: 'PUBLISHED' as const,
      publishedAt,
      createdAt: publishedAt,
    }
  },
)
