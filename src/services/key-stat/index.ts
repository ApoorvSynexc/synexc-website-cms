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

// Seeded from the "Why Leaders Choose Synexc?" cards on the website's contact page.
export const useKeyStat = createContentCollection<KeyStat>('key-stats', [
  {
    id: 's1',
    stat: '24/7',
    title: 'Execution Mindset',
    description: 'Round-the-clock commitment and execution discipline to keep your systems running smoothly.',
    icon: 'clock',
    isActive: true,
  },
  {
    id: 's2',
    stat: '12+',
    title: 'Core Capability Areas',
    description: 'Deep expertise across CRM, ITSM, custom software engineering, and AI automation.',
    icon: 'trophy',
    isActive: true,
  },
  {
    id: 's3',
    stat: '100+',
    title: 'Expert Talent Pool',
    description: 'A robust team of certified architects, engineers, and process consultants ready to scale.',
    icon: 'users',
    isActive: true,
  },
  {
    id: 's4',
    stat: '100%',
    title: 'Solution-First Approach',
    description: 'Every engagement is engineered for business results, clear audit trails, and zero bypass.',
    icon: 'shield',
    isActive: true,
  },
])
