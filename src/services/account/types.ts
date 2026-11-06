import type { Media } from '../media/types'

/** The logged-in user, from GET /account/my-profile. */
export type Profile = {
  id: string
  name: string
  email: string
  roleId: string
  role: { id: string; name: string; isSystem: boolean }
  /** "<subject>:<action>" keys the user's role grants, e.g. "blog:create". */
  permissions: string[]
  avatar: Media | null
}
