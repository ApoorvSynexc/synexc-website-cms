import type { Media } from '../media/types'

export type UserStatus = 'ACTIVE' | 'INACTIVE'

export type User = {
  id: string
  name: string
  email: string
  roleId: string
  status: UserStatus
  createdAt: string
  role?: { id: string; name: string; isSystem: boolean }
  avatar?: Media | null
}

export type UserInput = {
  name: string
  email: string
  /** Required on create; on edit leave empty to keep the current password. */
  password?: string
  roleId: string
  status: UserStatus
}

export type UserListParams = {
  page: number
  limit: number
  search?: string
  roleId?: string
  status?: UserStatus | ''
}
