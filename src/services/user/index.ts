import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { delay, mockError, newId } from '../../lib'
import { accountKeys, mockSession } from '../account'
import { access, persist } from '../access-store'
import { roleKeys } from '../role'
import type { User, UserInput, UserListParams } from './types'

export type { User, UserInput, UserListParams, UserStatus } from './types'

export const userKeys = {
  all: ['users'] as const,
  list: (params: UserListParams) => [...userKeys.all, 'list', params] as const,
}

// ---- Mock bodies (replace with http calls once the API is ready) ----
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const publicUser = ({ password: _password, ...user }: User & { password: string }): User => user

const assertEmailUnique = (email: string, ignoreId?: string) => {
  if (access.users.some((u) => u.id !== ignoreId && u.email.toLowerCase() === email.toLowerCase())) {
    throw mockError('A user with this email already exists', 409)
  }
}

const assertRoleExists = (roleId: string) => {
  if (!access.roles.some((r) => r.id === roleId)) throw mockError('Selected role no longer exists', 400)
}

export function useUser(options: { listParams?: UserListParams } = {}) {
  const queryClient = useQueryClient()
  const { listParams } = options
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: userKeys.all })
    queryClient.invalidateQueries({ queryKey: roleKeys.all }) // role user counts
    queryClient.invalidateQueries({ queryKey: accountKeys.all }) // in case it's the current user
  }

  const getUsers = useQuery({
    queryKey: userKeys.list(listParams ?? { page: 1, limit: 10 }),
    enabled: Boolean(listParams),
    queryFn: async () => {
      await delay(250)
      const { page, limit, search, roleId, status } = listParams!
      const q = search?.trim().toLowerCase()
      const filtered = access.users
        .filter((u) => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
        .filter((u) => !roleId || u.roleId === roleId)
        .filter((u) => !status || u.status === status)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      return {
        users: filtered.slice((page - 1) * limit, page * limit).map(publicUser),
        meta: { totalRecords: filtered.length },
      }
    },
  })

  const createUser = useMutation({
    mutationFn: async (input: UserInput & { password: string }) => {
      await delay()
      assertEmailUnique(input.email)
      assertRoleExists(input.roleId)
      access.users = [
        { id: newId(), createdAt: new Date().toISOString(), ...input },
        ...access.users,
      ]
      persist()
    },
    onSuccess: invalidate,
  })

  const updateUser = useMutation({
    mutationFn: async ({ id, ...input }: Partial<UserInput> & { id: string }) => {
      await delay()
      const isSelf = id === mockSession.userId()
      if (input.email) assertEmailUnique(input.email, id)
      if (input.roleId) assertRoleExists(input.roleId)
      if (isSelf && input.status === 'INACTIVE') {
        throw mockError('You cannot deactivate your own account', 400)
      }
      const { password, ...rest } = input
      access.users = access.users.map((u) =>
        u.id === id ? { ...u, ...rest, ...(password ? { password } : {}) } : u,
      )
      persist()
    },
    onSuccess: invalidate,
  })

  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      await delay()
      if (id === mockSession.userId()) throw mockError('You cannot delete your own account', 400)
      access.users = access.users.filter((u) => u.id !== id)
      persist()
    },
    onSuccess: invalidate,
  })

  return { getUsers, createUser, updateUser, deleteUser }
}
