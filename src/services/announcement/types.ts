import dayjs from 'dayjs'
import type { Media } from '../media/types'

export type AnnouncementType = 'POPUP' | 'BANNER'

export type Announcement = {
  id: string
  /** Short label shown above the headline, e.g. "Bharat Dreamin' 2026". */
  badge: string
  title: string
  message: string
  type: AnnouncementType
  /** Event details (optional). YYYY-MM-DD, or '' */
  eventDate: string
  venue: string
  /** Call-to-action button (both or neither). */
  ctaLabel: string
  ctaUrl: string
  imageId: string | null
  /** Logo / banner image (an uploaded file, optional). */
  image: Media | null
  /** Display window, inclusive. YYYY-MM-DD */
  startDate: string
  endDate: string
  /** The on/off switch (the API's row `status` ACTIVE / INACTIVE). */
  isActive: boolean
  createdAt: string
}

export type AnnouncementInput = {
  badge: string
  title: string
  message: string
  type: AnnouncementType
  eventDate: string
  venue: string
  ctaLabel: string
  ctaUrl: string
  /** Id of an uploaded file (see useMedia); null clears it. */
  imageId: string | null
  startDate: string
  endDate: string
  isActive: boolean
}

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
