import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useHttpClient } from '../../hooks/useHttpClient'
import { dateOnly, toQuery, totalRecords } from '../../lib'
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

/** What the API returns: optional text columns are null and dates are ISO timestamps; the on/off switch is `status`. */
type ApiAnnouncement = Omit<Announcement, 'isActive' | 'badge' | 'venue' | 'ctaLabel' | 'ctaUrl' | 'eventDate'> & {
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED'
  badge: string | null
  venue: string | null
  ctaLabel: string | null
  ctaUrl: string | null
  eventDate: string | null
}

const fromApi = (a: ApiAnnouncement): Announcement => {
  const { status, ...rest } = a
  return {
    ...rest,
    badge: a.badge ?? '',
    venue: a.venue ?? '',
    ctaLabel: a.ctaLabel ?? '',
    ctaUrl: a.ctaUrl ?? '',
    eventDate: dateOnly(a.eventDate),
    startDate: dateOnly(a.startDate),
    endDate: dateOnly(a.endDate),
    isActive: status === 'ACTIVE',
  }
}

/** The page works with `isActive`; the API stores it as the row status. Only the keys given are sent. */
const toApi = ({ isActive, ...rest }: Partial<AnnouncementInput>) => ({
  ...rest,
  ...(isActive !== undefined && { status: isActive ? 'ACTIVE' : 'INACTIVE' }),
})

export function useAnnouncement(options: { listParams?: AnnouncementListParams } = {}) {
  const http = useHttpClient()
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: announcementKeys.all })
  const { listParams } = options

  const getAnnouncements = useQuery({
    queryKey: announcementKeys.list(listParams ?? { page: 1, limit: 10 }),
    enabled: Boolean(listParams),
    queryFn: async () => {
      const { page, limit, search, type } = listParams!
      const res = await http.get<ApiAnnouncement[]>(`/v1/announcement/list${toQuery({ page, limit, search, type })}`)
      return { announcements: res.data.map(fromApi), meta: { totalRecords: totalRecords(res.meta) } }
    },
  })

  const createAnnouncement = useMutation({
    mutationFn: (input: AnnouncementInput) => http.post<ApiAnnouncement>('/v1/announcement', toApi(input)),
    onSuccess: invalidate,
  })

  const updateAnnouncement = useMutation({
    mutationFn: ({ id, ...input }: Partial<AnnouncementInput> & { id: string }) =>
      http.put<ApiAnnouncement>('/v1/announcement', { id, ...toApi(input) }),
    onSuccess: invalidate,
  })

  const deleteAnnouncement = useMutation({
    mutationFn: (id: string) => http.delete<null>(`/v1/announcement${toQuery({ id })}`),
    onSuccess: invalidate,
  })

  return { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement }
}
