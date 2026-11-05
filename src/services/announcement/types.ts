import dayjs from 'dayjs'

export type AnnouncementType = 'POPUP' | 'BANNER'

export type Announcement = {
  id: string
  /** Short label shown above the headline, e.g. "Bharat Dreamin' 2026". */
  badge: string
  title: string
  message: string
  type: AnnouncementType
  /** Event details (optional). YYYY-MM-DD */
  eventDate: string
  venue: string
  /** Call-to-action button (both or neither). */
  ctaLabel: string
  ctaUrl: string
  /** Logo / banner image URL (optional). */
  image: string
  /** Display window, inclusive. YYYY-MM-DD */
  startDate: string
  endDate: string
  isActive: boolean
  createdAt: string
}

export type AnnouncementInput = Omit<Announcement, 'id' | 'createdAt'>

export type AnnouncementListParams = {
  page: number
  limit: number
  search?: string
  type?: AnnouncementType | ''
}

export type AnnouncementState = 'LIVE' | 'SCHEDULED' | 'EXPIRED' | 'INACTIVE'

/** What visitors would see right now for this announcement. */
export function getAnnouncementState(
  a: Pick<Announcement, 'isActive' | 'startDate' | 'endDate'>,
): AnnouncementState {
  if (!a.isActive) return 'INACTIVE'
  const today = dayjs().format('YYYY-MM-DD')
  if (today < a.startDate) return 'SCHEDULED'
  if (today > a.endDate) return 'EXPIRED'
  return 'LIVE'
}
