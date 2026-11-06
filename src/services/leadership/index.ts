import type { Media } from '../media/types'
import { createContentCollection } from '../website-content/collection'

export type TeamMember = {
  id: string
  name: string
  role: string
  bio: string
  photoId: string | null
  /** Optional photo (an uploaded file). Without one the website shows the person's initial. */
  photo: Media | null
  linkedin: string
  email: string
  isActive: boolean
}

export type TeamMemberInput = {
  name: string
  role: string
  bio: string
  photoId: string | null
  linkedin: string
  email: string
  isActive: boolean
}

export const useLeadership = createContentCollection<TeamMember, TeamMemberInput>({
  key: 'leadership',
  path: 'team-member',
  fromApi: ({ status, ...row }) =>
    ({
      ...row,
      linkedin: (row.linkedin as string | null) ?? '',
      email: (row.email as string | null) ?? '',
      isActive: status === 'ACTIVE',
    }) as unknown as TeamMember,
})
