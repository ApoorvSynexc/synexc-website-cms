import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { delay, mockError } from '../../lib'
import { accountKeys } from '../account'
import { PERMISSIONS, access, permissionIdsOf, persist } from '../access-store'
import { roleKeys } from '../role'
import type { UpdateRolePermissionsInput } from './types'

export type { Permission, UpdateRolePermissionsInput } from './types'

export const rolePermissionKeys = {
  all: ['role-permission'] as const,
  permissions: () => [...rolePermissionKeys.all, 'permissions'] as const,
  byRole: (roleId: string) => [...rolePermissionKeys.all, 'by-role', roleId] as const,
}

// ---- Mock bodies (replace with http calls once the API is ready) ----
export function useRolePermission({ roleId }: { roleId?: string } = {}) {
  const queryClient = useQueryClient()

  /** Every permission that exists (the matrix rows × columns). */
  const getPermissions = useQuery({
    queryKey: rolePermissionKeys.permissions(),
    queryFn: async () => {
      await delay(150)
      return PERMISSIONS
    },
  })

  /** The permission ids granted to the selected role. */
  const getRolePermissions = useQuery({
    queryKey: rolePermissionKeys.byRole(roleId ?? ''),
    enabled: Boolean(roleId),
    queryFn: async () => {
      await delay(250)
      const role = access.roles.find((r) => r.id === roleId)
      return role ? permissionIdsOf(role) : []
    },
  })

  const updatePermissions = useMutation({
    mutationFn: async ({ roleId, permissionIds }: UpdateRolePermissionsInput) => {
      await delay()
      const role = access.roles.find((r) => r.id === roleId)
      if (!role) throw mockError('Role not found', 404)
      if (role.isSystem) throw mockError('The Admin role always has full access', 400)
      access.roles = access.roles.map((r) => (r.id === roleId ? { ...r, permissionIds } : r))
      persist()
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: rolePermissionKeys.byRole(variables.roleId) })
      queryClient.invalidateQueries({ queryKey: roleKeys.all })
      queryClient.invalidateQueries({ queryKey: accountKeys.all }) // refresh the current user's access
    },
  })

  return { getPermissions, getRolePermissions, updatePermissions }
}
