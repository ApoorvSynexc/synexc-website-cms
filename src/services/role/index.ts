import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { delay, mockError, newId } from '../../lib'
import { access, persist } from '../access-store'
import type { RoleInput, RoleWithCount } from './types'

export type { Role, RoleInput, RoleWithCount } from './types'

export const roleKeys = {
  all: ['roles'] as const,
}

// ---- Mock bodies (replace with http calls once the API is ready) ----
const assertNameUnique = (name: string, ignoreId?: string) => {
  if (access.roles.some((r) => r.id !== ignoreId && r.name.toLowerCase() === name.toLowerCase())) {
    throw mockError('A role with this name already exists', 409)
  }
}

export function useRole() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: roleKeys.all })

  const getRoles = useQuery({
    queryKey: roleKeys.all,
    queryFn: async (): Promise<RoleWithCount[]> => {
      await delay(250)
      return access.roles.map((r) => ({
        ...r,
        userCount: access.users.filter((u) => u.roleId === r.id).length,
      }))
    },
  })

  const createRole = useMutation({
    mutationFn: async (input: RoleInput) => {
      await delay()
      assertNameUnique(input.name)
      access.roles = [
        ...access.roles,
        { id: newId(), isSystem: false, permissionIds: [], ...input },
      ]
      persist()
    },
    onSuccess: invalidate,
  })

  const updateRole = useMutation({
    mutationFn: async ({ id, ...input }: RoleInput & { id: string }) => {
      await delay()
      const role = access.roles.find((r) => r.id === id)
      if (role?.isSystem) throw mockError('The Admin role cannot be modified', 400)
      assertNameUnique(input.name, id)
      access.roles = access.roles.map((r) => (r.id === id ? { ...r, ...input } : r))
      persist()
    },
    onSuccess: invalidate,
  })

  const deleteRole = useMutation({
    mutationFn: async (id: string) => {
      await delay()
      const role = access.roles.find((r) => r.id === id)
      if (role?.isSystem) throw mockError('The Admin role cannot be deleted', 400)
      const assigned = access.users.filter((u) => u.roleId === id).length
      if (assigned > 0) {
        throw mockError(
          `${assigned} user${assigned > 1 ? 's are' : ' is'} assigned to this role. Reassign them first.`,
          409,
        )
      }
      access.roles = access.roles.filter((r) => r.id !== id)
      persist()
    },
    onSuccess: invalidate,
  })

  return { getRoles, createRole, updateRole, deleteRole }
}
