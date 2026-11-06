import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useHttpClient } from '../../hooks/useHttpClient'
import { toQuery, totalRecords } from '../../lib'
import { accountKeys } from '../account'
import { roleKeys } from '../role'
import type { User, UserInput, UserListParams } from './types'

export type { User, UserInput, UserListParams, UserStatus } from './types'

export const userKeys = {
  all: ['users'] as const,
  list: (params: UserListParams) => [...userKeys.all, 'list', params] as const,
}

export function useUser(options: { listParams?: UserListParams } = {}) {
  const http = useHttpClient()
  const queryClient = useQueryClient()
  const { listParams } = options
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: userKeys.all })
    queryClient.invalidateQueries({ queryKey: roleKeys.all }) // role user counts
    queryClient.invalidateQueries({ queryKey: accountKeys.all }) // in case it is the current user
  }

  const getUsers = useQuery({
    queryKey: userKeys.list(listParams ?? { page: 1, limit: 10 }),
    enabled: Boolean(listParams),
    queryFn: async () => {
      const { page, limit, search, roleId, status } = listParams!
      const res = await http.get<User[]>(`/v1/user/list${toQuery({ page, limit, search, roleId, status })}`)
      return { users: res.data, meta: { totalRecords: totalRecords(res.meta) } }
    },
  })

  const createUser = useMutation({
    mutationFn: (input: UserInput & { password: string }) => http.post<User>('/v1/user', input),
    onSuccess: invalidate,
  })

  const updateUser = useMutation({
    mutationFn: ({ id, ...input }: Partial<UserInput> & { id: string }) => http.put<User>('/v1/user', { id, ...input }),
    onSuccess: invalidate,
  })

  const deleteUser = useMutation({
    mutationFn: (id: string) => http.delete<null>(`/v1/user${toQuery({ id })}`),
    onSuccess: invalidate,
  })

  return { getUsers, createUser, updateUser, deleteUser }
}
