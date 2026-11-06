export type Role = {
  id: string
  name: string
  description: string | null
  /**
   * Built-in role (e.g. Super Admin). This only protects it — it cannot be renamed, deleted or have its
   * permissions edited. What a role can do always comes from its permissions.
   */
  isSystem: boolean
  status: 'ACTIVE' | 'INACTIVE'
  userCount: number
  permissionCount: number
}

export type RoleInput = { name: string; description: string }
