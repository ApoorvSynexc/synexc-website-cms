import { useState } from 'react'
import { FiEdit2, FiLock, FiPlus, FiTrash2 } from 'react-icons/fi'
import { Button, ConfirmDialog, ModuleHeader, Table, type TableColumn } from '../../../components'
import { useSession } from '../../../hooks'
import { getErrorMessage } from '../../../lib'
import { useRole, type Role } from '../../../services'
import ManageRoleModal from './manage'

export default function RoleModule() {
  const { can } = useSession()
  const [manageOpen, setManageOpen] = useState(false)
  const [editing, setEditing] = useState<Role | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null)
  const { getRoles, deleteRole } = useRole()

  const canCreate = can('role', 'create')
  const canUpdate = can('role', 'update')
  const canDelete = can('role', 'delete')

  const columns: TableColumn<Role>[] = [
    { key: 'serial', header: '#', width: '56px', render: (_r, i) => i + 1 },
    {
      key: 'name',
      header: 'Role',
      render: (row) => (
        <span className="flex items-center gap-2 font-medium text-heading">
          {row.name}
          {row.isSystem && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600">
              <FiLock size={10} /> System
            </span>
          )}
        </span>
      ),
    },
    { key: 'description', header: 'Description', render: (row) => row.description || '—' },
    {
      key: 'permissions',
      header: 'Permissions',
      render: (row) => row.permissionCount,
    },
    { key: 'users', header: 'Users', render: (row) => row.userCount },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      width: '110px',
      render: (row) =>
        row.isSystem ? (
          <span className="text-body/40">—</span>
        ) : (
          <div className="flex justify-end gap-1">
            {canUpdate && (
              <button
                type="button"
                aria-label={`Edit ${row.name}`}
                onClick={() => {
                  setEditing(row)
                  setManageOpen(true)
                }}
                className="rounded-lg p-2 text-body transition-colors hover:bg-surface-2 hover:text-heading"
              >
                <FiEdit2 size={15} />
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                aria-label={`Delete ${row.name}`}
                onClick={() => setDeleteTarget(row)}
                className="rounded-lg p-2 text-body transition-colors hover:bg-surface-2 hover:text-red-500"
              >
                <FiTrash2 size={15} />
              </button>
            )}
          </div>
        ),
    },
  ]

  return (
    <div>
      <ModuleHeader
        title="Roles"
        description="Create roles, then choose what each one can do."
        action={
          canCreate && (
            <Button
              size="sm"
              leftIcon={<FiPlus size={16} />}
              onClick={() => {
                setEditing(null)
                setManageOpen(true)
              }}
            >
              Add Role
            </Button>
          )
        }
      />
      <Table
        columns={columns}
        data={getRoles.data ?? []}
        rowKey={(row) => row.id}
        loading={getRoles.isLoading}
        emptyMessage="No roles added yet."
      />
      <ManageRoleModal open={manageOpen} onClose={() => setManageOpen(false)} role={editing} />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Role"
        message={
          deleteRole.isError
            ? getErrorMessage(deleteRole.error)
            : `Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`
        }
        loading={deleteRole.isPending}
        onConfirm={() =>
          deleteTarget && deleteRole.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }
        onCancel={() => {
          setDeleteTarget(null)
          deleteRole.reset()
        }}
      />
    </div>
  )
}
