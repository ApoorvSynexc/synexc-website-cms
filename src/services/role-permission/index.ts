import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useHttpClient } from '../../hooks/useHttpClient'
import { toQuery } from '../../lib'
import { accountKeys } from '../account'
import { roleKeys } from '../role'
import type { Permission, UpdateRolePermissionsInput } from './types'

export type { Permission, UpdateRolePermissionsInput } from './types'

export const rolePermissionKeys = {
  all: ['role-permission'] as const,
  permissions: () => [...rolePermissionKeys.all, 'permissions'] as const,
  byRole: (roleId: string) => [...rolePermissionKeys.all, 'by-role', roleId] as const,
}

type RolePermissionEntry = { permissionId: string }

export function useRolePermission({ roleId }: { roleId?: string } = {}) {
  const http = useHttpClient()
  const queryClient = useQueryClient()

  /** Every permission that exists (the matrix rows × columns). */
  const getPermissions = useQuery({
    queryKey: rolePermissionKeys.permissions(),
    queryFn: async () => (await http.get<Permission[]>('/v1/role-permission/permissions')).data,
  })

  /** The ids of the permissions granted to the selected role. */
  const getRolePermissions = useQuery({
    queryKey: rolePermissionKeys.byRole(roleId ?? ''),
    enabled: Boolean(roleId),
    queryFn: async () => {
      const res = await http.get<RolePermissionEntry[]>(`/v1/role-permission/list${toQuery({ roleId })}`)
      return res.data.map((entry) => entry.permissionId)
    },
  })

  const updatePermissions = useMutation({
    mutationFn: (input: UpdateRolePermissionsInput) => http.put<RolePermissionEntry[]>('/v1/role-permission', input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: rolePermissionKeys.byRole(variables.roleId) })
      queryClient.invalidateQueries({ queryKey: roleKeys.all })
      queryClient.invalidateQueries({ queryKey: accountKeys.all }) // the current user's access may have changed
    },
  })

  return { getPermissions, getRolePermissions, updatePermissions }
}
