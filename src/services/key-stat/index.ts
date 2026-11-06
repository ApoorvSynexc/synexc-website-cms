import { createContentCollection } from '../website-content/collection'

export const KEY_STAT_ICONS = [
  { value: 'clock', label: 'Clock' },
  { value: 'trophy', label: 'Trophy' },
  { value: 'users', label: 'People' },
  { value: 'shield', label: 'Shield' },
] as const

export type KeyStat = {
  id: string
  /** The headline figure, e.g. "24/7", "12+", "100%". */
  stat: string
  title: string
  description: string
  icon: string
  isActive: boolean
}

export const useKeyStat = createContentCollection<KeyStat>({ key: 'key-stats', path: 'key-stat' })
