import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { delay } from '../../lib'
import { SEED_INQUIRIES } from './seed'
import type {
  Inquiry,
  InquiryFilters,
  InquiryListParams,
  InquiryStatus,
  InquiryUpdate,
} from './types'

export { INQUIRY_STATUSES } from './types'
export type {
  Inquiry,
  InquiryFilters,
  InquiryListParams,
  InquiryStatus,
  InquiryUpdate,
} from './types'

export const inquiryKeys = {
  all: ['inquiries'] as const,
  list: (params: InquiryListParams) => [...inquiryKeys.all, 'list', params] as const,
  counts: () => [...inquiryKeys.all, 'counts'] as const,
}

// ---- Mock store (replace the bodies below with http calls once the API is ready) ----
let inquiries: Inquiry[] = [...SEED_INQUIRIES]

const applyFilters = ({ search, status, specialization }: InquiryFilters) => {
  const q = search?.trim().toLowerCase()
  return inquiries
    .filter((i) => {
      if (!q) return true
      const haystack = `${i.firstName} ${i.lastName} ${i.email} ${i.phone} ${i.description}`.toLowerCase()
      return haystack.includes(q)
    })
    .filter((i) => !status || i.status === status)
    .filter((i) => !specialization || i.specialization === specialization)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function useInquiry(options: { listParams?: InquiryListParams } = {}) {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: inquiryKeys.all })
  const { listParams } = options

  const getInquiries = useQuery({
    queryKey: inquiryKeys.list(listParams ?? { page: 1, limit: 10 }),
    enabled: Boolean(listParams),
    queryFn: async () => {
      await delay(250)
      const { page, limit, ...filters } = listParams!
      const filtered = applyFilters(filters)
      return {
        inquiries: filtered.slice((page - 1) * limit, page * limit),
        meta: { totalRecords: filtered.length },
        // Specializations present in the data, to populate the filter dropdown.
        specializations: [...new Set(inquiries.map((i) => i.specialization).filter(Boolean))].sort(),
      }
    },
  })

  const updateInquiry = useMutation({
    mutationFn: async ({ id, ...patch }: InquiryUpdate) => {
      await delay(300)
      inquiries = inquiries.map((i) => (i.id === id ? { ...i, ...patch } : i))
    },
    onSuccess: invalidate,
  })

  const deleteInquiry = useMutation({
    mutationFn: async (id: string) => {
      await delay()
      inquiries = inquiries.filter((i) => i.id !== id)
    },
    onSuccess: invalidate,
  })

  /** Every inquiry matching the filters (no paging) — for CSV export. */
  const exportInquiries = useMutation({
    mutationFn: async (filters: InquiryFilters) => {
      await delay(300)
      return applyFilters(filters)
    },
  })

  return { getInquiries, updateInquiry, deleteInquiry, exportInquiries }
}

/** Inquiry counts per status (plus total) — for the status tabs and the sidebar badge. */
export function useInquiryCounts(enabled = true) {
  return useQuery({
    queryKey: inquiryKeys.counts(),
    enabled,
    queryFn: async () => {
      await delay(150)
      const counts: Record<InquiryStatus | 'ALL', number> = {
        ALL: inquiries.length,
        NEW: 0,
        CONTACTED: 0,
        QUALIFIED: 0,
        CLOSED: 0,
      }
      inquiries.forEach((i) => (counts[i.status] += 1))
      return counts
    },
  })
}
