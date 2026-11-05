import dayjs from 'dayjs'
import type { Blog } from './types'

const body = (heading: string) =>
  `<h2>${heading}</h2><p>Placeholder article body. Replace it with the real post content written in HTML.</p><ul><li>Key point one</li><li>Key point two</li></ul>`

/** Last tuple value: how many days ago the post was published (keeps dashboard charts populated). */
const ROWS: [string, string, string, string, Blog['status'], number][] = [
  ['ai-in-gaming', 'How AI Is Revolutionizing the Gaming Industry in 2026', 'c1', 'Alex Rivera', 'PUBLISHED', 2],
  ['salesforce-automation-trends', 'Top 5 Salesforce Automation Trends to Watch This Year', 'c2', 'Sarah Chen', 'PUBLISHED', 8],
  ['future-of-cloud-computing', 'The Future of Multi-Cloud Strategy in Enterprise', 'c3', 'Priya Nair', 'PUBLISHED', 15],
  ['zoho-crm-migration-guide', 'A Practical Guide to Migrating to Zoho CRM', 'c4', 'Rahul Mehta', 'DRAFT', 5],
  ['digital-transformation-roadmap', 'Building a Digital Transformation Roadmap That Sticks', 'c5', 'Sarah Chen', 'PUBLISHED', 40],
  ['agentic-ai-for-support', 'Agentic AI for Customer Support: What Actually Works', 'c1', 'Alex Rivera', 'DRAFT', 3],
  ['salesforce-flow-best-practices', 'Salesforce Flow Best Practices for Scalable Orgs', 'c2', 'Rahul Mehta', 'PUBLISHED', 70],
  ['cloud-cost-optimisation', 'Cloud Cost Optimisation: 7 Quick Wins', 'c3', 'Priya Nair', 'PUBLISHED', 95],
  ['zoho-vs-salesforce', 'Zoho vs Salesforce: Choosing the Right CRM', 'c4', 'Sarah Chen', 'PUBLISHED', 120],
  ['data-driven-decisions', 'Turning Data into Decisions Across the Organisation', 'c5', 'Alex Rivera', 'PUBLISHED', 150],
]

export const SEED_BLOGS: Blog[] = ROWS.map(
  ([slug, title, categoryId, author, status, daysAgo], i) => {
    const publishedAt = dayjs().subtract(daysAgo, 'day').format('YYYY-MM-DD')
    return {
    id: `b${i + 1}`,
    slug,
    title,
    excerpt: `${title} — a short summary shown on the blog listing page.`,
    content: body(title),
    categoryId,
    author,
    featuredImage: '',
    status,
    publishedAt,
    createdAt: publishedAt,
  }
  },
)
