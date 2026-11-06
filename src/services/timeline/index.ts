import { createContentCollection } from '../website-content/collection'

export type TimelineEvent = {
  id: string
  /** Four-digit year, e.g. "2023" (the API stores a number). */
  year: string
  title: string
  description: string
  isActive: boolean
}

export const useTimeline = createContentCollection<TimelineEvent>({
  key: 'timeline',
  path: 'timeline-event',
  fromApi: ({ status, ...row }) =>
    ({ ...row, year: String(row.year), isActive: status === 'ACTIVE' }) as unknown as TimelineEvent,
  toApi: (input) => ({ ...input, ...(input.year !== undefined && { year: Number(input.year) }) }),
})
