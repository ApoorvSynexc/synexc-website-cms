/** `id` is "<subject>:<action>", e.g. "blog:create". */
export type Permission = {
  id: string
  subject: string
  action: string
}

export type UpdateRolePermissionsInput = {
  roleId: string
  permissionIds: string[]
}
