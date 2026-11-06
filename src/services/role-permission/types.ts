/** One cell of the matrix. `id` is the backend id; `subject` / `action` say which module and verb. */
export type Permission = {
  id: string
  subject: string
  action: string
}

export type UpdateRolePermissionsInput = {
  roleId: string
  permissionIds: string[]
}
