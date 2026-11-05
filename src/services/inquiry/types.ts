export type InquiryStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CLOSED'

export const INQUIRY_STATUSES: { value: InquiryStatus; label: string }[] = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'QUALIFIED', label: 'Qualified' },
  { value: 'CLOSED', label: 'Closed' },
]

/**
 * Mirrors the website's `inquires` collection (firstName … description, plus
 * timestamps). `status`, `assigneeId` and `notes` are CMS-side additions the
 * website model does not have yet — the backend needs to add them.
 */
export type Inquiry = {
  id: string
  firstName: string
  lastName: string
  email: string
  dialCode: { country: string; iso2: string; code: string }
  phone: string
  /** The "objective" chosen on the contact form. */
  specialization: string
  teamSize: string
  description: string
  status: InquiryStatus
  /** CMS user id, or '' when unassigned. */
  assigneeId: string
  notes: string
  createdAt: string
}

export type InquiryUpdate = Partial<Pick<Inquiry, 'status' | 'assigneeId' | 'notes'>> & { id: string }

export type InquiryFilters = {
  search?: string
  status?: InquiryStatus | ''
  specialization?: string
}

export type InquiryListParams = InquiryFilters & { page: number; limit: number }
