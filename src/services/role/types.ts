export type Role = {
  id: string
  name: string
  description: string
  /** System roles (Admin) have full access and cannot be edited or deleted. */
  isSystem: boolean
  permissionIds: string[]
}

export type RoleWithCount = Role & { userCount: number }

export type RoleInput = Pick<Role, 'name' | 'description'>
