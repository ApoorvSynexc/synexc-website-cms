import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useHttpClient } from '../../hooks/useHttpClient'
import { toQuery } from '../../lib'
import type { Role, RoleInput } from './types'

export type { Role, RoleInput } from './types'

export const roleKeys = {
  all: ['roles'] as const,
}

export function useRole() {
  const http = useHttpClient()
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: roleKeys.all })

  /** Not paginated — there are only a handful of roles. */
  const getRoles = useQuery({
    queryKey: roleKeys.all,
    queryFn: async () => (await http.get<Role[]>('/v1/role/list')).data,
  })

  const createRole = useMutation({
    mutationFn: (input: RoleInput) => http.post<Role>('/v1/role', input),
    onSuccess: invalidate,
  })

  const updateRole = useMutation({
    mutationFn: ({ id, ...input }: RoleInput & { id: string }) => http.put<Role>('/v1/role', { id, ...input }),
    onSuccess: invalidate,
  })

  const deleteRole = useMutation({
    mutationFn: (id: string) => http.delete<null>(`/v1/role${toQuery({ id })}`),
    onSuccess: invalidate,
  })

  return { getRoles, createRole, updateRole, deleteRole }
}
