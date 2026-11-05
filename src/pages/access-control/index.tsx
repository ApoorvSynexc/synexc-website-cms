import type { ComponentType } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { FiKey, FiShield, FiUsers } from 'react-icons/fi'
import { SectionLayout } from '../../components'
import { useSession } from '../../hooks'
import User from './user'
import Role from './role'
import RolePermission from './role-permission'

type ModuleItem = {
  key: string
  label: string
  icon: ComponentType<{ size?: number }>
  component: ComponentType
  /** Permission subject needed to see this module (action: read). */
  subject: string
}

const MODULES: ModuleItem[] = [
  { key: 'user', label: 'Users', icon: FiUsers, component: User, subject: 'user' },
  { key: 'role', label: 'Roles', icon: FiShield, component: Role, subject: 'role' },
  {
    key: 'role-permission',
    label: 'Role Permissions',
    icon: FiKey,
    component: RolePermission,
    subject: 'role_permission',
  },
]

export default function AccessControlPage() {
  const { module } = useParams<{ module: string }>()
  const navigate = useNavigate()
  const { can } = useSession()

  const visible = MODULES.filter((m) => can(m.subject, 'read'))
  const active = visible.find((m) => m.key === module)

  if (!active) {
    return visible.length > 0 ? (
      <Navigate to={`/access-control/${visible[0].key}`} replace />
    ) : (
      <Navigate to="/" replace />
    )
  }

  const ActiveModule = active.component

  return (
    <SectionLayout
      title="Access Control"
      description="Manage who can sign in and what they are allowed to do."
      items={visible}
      active={active.key}
      onSelect={(key) => navigate(`/access-control/${key}`)}
    >
      <ActiveModule />
    </SectionLayout>
  )
}
