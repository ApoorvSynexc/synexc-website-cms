import type { Inquiry, InquiryStatus } from './types'

const IN = { country: 'India', iso2: 'in', code: '+91' }
const US = { country: 'United States', iso2: 'us', code: '+1' }
const UK = { country: 'United Kingdom', iso2: 'gb', code: '+44' }
const AE = { country: 'United Arab Emirates', iso2: 'ae', code: '+971' }
const NG = { country: 'Nigeria', iso2: 'ng', code: '+234' }

// first, last, email, dialCode, phone, specialization, teamSize, status, hours ago, message
type Row = [string, string, string, Inquiry['dialCode'], string, string, string, InquiryStatus, number, string]

// Sample data only — fictional people. Real inquiries come from the website forms.
const ROWS: Row[] = [
  ['Aarav', 'Mehta', 'aarav.mehta@example.com', IN, '9810000011', 'Strategic CRM Implementation', '51-200', 'NEW', 2, 'We are moving from spreadsheets to a CRM and need help choosing between Salesforce and Zoho.'],
  ['Emily', 'Carter', 'emily.carter@example.com', US, '4155550101', 'AI-First Automation', '11-50', 'NEW', 5, 'Looking to automate document intake for our compliance team. Can we book a call this week?'],
  ['Tunde', 'Adeyemi', 'tunde.adeyemi@example.com', NG, '8030000123', 'Strategic CRM Implementation', '1-10', 'NEW', 20, 'Interested in a Zoho CRM setup for our agri-business with billing integration.'],
  ['Sophie', 'Clarke', 'sophie.clarke@example.com', UK, '7700900123', 'Enterprise Cloud Strategy', '200+', 'CONTACTED', 30, 'We want to review our multi-cloud setup and reduce cost. Please share your engagement models.'],
  ['Omar', 'Hassan', 'omar.hassan@example.com', AE, '501234567', 'Zohoholics 2026 - 1-1 Meeting', '11-50', 'CONTACTED', 52, 'Would like a 1-1 meeting at Zohoholics to discuss a Zoho One rollout.'],
  ['Neha', 'Kapoor', 'neha.kapoor@example.com', IN, '9899000044', 'AI-First Automation', '51-200', 'QUALIFIED', 76, 'Need an AI assistant for our support desk, integrated with ServiceNow. Budget approved.'],
  ['Daniel', 'Reyes', 'daniel.reyes@example.com', US, '2125550177', 'Strategic CRM Implementation', '200+', 'QUALIFIED', 100, 'Salesforce data migration from a legacy system, about 2M records.'],
  ['Priyanka', 'Joshi', 'priyanka.joshi@example.com', IN, '9822000055', 'Enterprise Cloud Strategy', '11-50', 'CONTACTED', 130, 'Looking for AWS managed services and monitoring for a SaaS product.'],
  ['Liam', 'Walker', 'liam.walker@example.com', UK, '7911123456', 'AI-First Automation', '1-10', 'CLOSED', 200, 'Asked for pricing on a chatbot. Decided to build in-house.'],
  ['Fatima', 'Zahra', 'fatima.zahra@example.com', AE, '555001122', 'Strategic CRM Implementation', '51-200', 'CLOSED', 260, 'Wanted HubSpot onboarding; went with another vendor.'],
  ['Rohan', 'Das', 'rohan.das@example.com', IN, '9830000066', 'Enterprise Cloud Strategy', '200+', 'NEW', 8, 'Need Azure migration support for 40 on-prem servers.'],
  ['Grace', 'Okafor', 'grace.okafor@example.com', NG, '8099988877', 'AI-First Automation', '11-50', 'CONTACTED', 300, 'Interested in workflow automation for loan approvals.'],
  ['Ethan', 'Brooks', 'ethan.brooks@example.com', US, '6505550142', 'Strategic CRM Implementation', '1-10', 'CLOSED', 400, 'Just exploring options, no immediate project.'],
  ['Ananya', 'Rao', 'ananya.rao@example.com', IN, '9845000088', 'Zohoholics 2026 - 1-1 Meeting', '51-200', 'QUALIFIED', 150, 'Booked a 1-1 at Zohoholics; wants a proposal for Creator apps.'],
]

export const SEED_INQUIRIES: Inquiry[] = ROWS.map(
  ([firstName, lastName, email, dialCode, phone, specialization, teamSize, status, hoursAgo, description], i) => ({
    id: `iq${i + 1}`,
    firstName,
    lastName,
    email,
    dialCode,
    phone,
    specialization,
    teamSize,
    description,
    status,
    assigneeId: status === 'NEW' ? '' : 'u-priya',
    notes: status === 'NEW' ? '' : 'Initial call done.',
    createdAt: new Date(Date.now() - hoursAgo * 3_600_000).toISOString(),
  }),
)
