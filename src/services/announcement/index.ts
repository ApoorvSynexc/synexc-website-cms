import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { delay, newId } from '../../lib'
import type { Announcement, AnnouncementInput, AnnouncementListParams } from './types'

export { getAnnouncementState } from './types'
export type {
  Announcement,
  AnnouncementInput,
  AnnouncementListParams,
  AnnouncementState,
  AnnouncementType,
} from './types'

export const announcementKeys = {
  all: ['announcements'] as const,
  list: (params: AnnouncementListParams) => [...announcementKeys.all, 'list', params] as const,
}

// ---- Mock store (replace the bodies below with http calls once the API is ready) ----
// Seeded from the popup currently hardcoded in the website (BharatDreaminPopup.tsx).
let announcements: Announcement[] = [
  {
    id: 'an1',
    badge: "Bharat Dreamin' 2026",
    title: "Meet Team Synexc at Bharat Dreamin'",
    message: "We're bringing 15 members and a speaker to India's biggest Salesforce event.",
    type: 'POPUP',
    eventDate: '2026-07-11',
    venue: 'RIC, Jaipur, Rajasthan',
    ctaLabel: 'See You at Jaipur',
    ctaUrl:
      'https://blogs.synexc.com/synexc-at-bharat-dreamin-2026-exploring-zero-click-salesforce-with-autonomous-agents/',
    image: '',
    startDate: '2026-05-01',
    endDate: '2026-07-11',
    isActive: true,
    createdAt: '2026-05-01T00:00:00.000Z',
  },
]

export function useAnnouncement(options: { listParams?: AnnouncementListParams } = {}) {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: announcementKeys.all })
  const { listParams } = options

  const getAnnouncements = useQuery({
    queryKey: announcementKeys.list(listParams ?? { page: 1, limit: 10 }),
    enabled: Boolean(listParams),
    queryFn: async () => {
      await delay(250)
      const { page, limit, search, type } = listParams!
      const q = search?.trim().toLowerCase()
      const filtered = announcements
        .filter((a) => !q || a.title.toLowerCase().includes(q) || a.badge.toLowerCase().includes(q))
        .filter((a) => !type || a.type === type)
        .sort((a, b) => b.startDate.localeCompare(a.startDate))
      return {
        announcements: filtered.slice((page - 1) * limit, page * limit),
        meta: { totalRecords: filtered.length },
      }
    },
  })

  const createAnnouncement = useMutation({
    mutationFn: async (input: AnnouncementInput) => {
      await delay()
      announcements = [{ id: newId(), createdAt: new Date().toISOString(), ...input }, ...announcements]
    },
    onSuccess: invalidate,
  })

  const updateAnnouncement = useMutation({
    mutationFn: async ({ id, ...input }: Partial<AnnouncementInput> & { id: string }) => {
      await delay()
      announcements = announcements.map((a) => (a.id === id ? { ...a, ...input } : a))
    },
    onSuccess: invalidate,
  })

  const deleteAnnouncement = useMutation({
    mutationFn: async (id: string) => {
      await delay()
      announcements = announcements.filter((a) => a.id !== id)
    },
    onSuccess: invalidate,
  })

  return { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement }
}
