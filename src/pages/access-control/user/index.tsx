import { useState } from 'react'
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi'
import {
  Avatar,
  Button,
  ConfirmDialog,
  Dropdown,
  ModuleHeader,
  Table,
  TextField,
  ToggleButton,
  Typography,
  type TableColumn,
} from '../../../components'
import { useSession } from '../../../hooks'
import { getErrorMessage } from '../../../lib'
import { useRole, useUser, type User, type UserStatus } from '../../../services'
import { formatDate } from '../../../utils/date'
import ManageUserModal from './manage'

const PAGE_SIZE = 10

const STATUS_FILTER = [
  { label: 'All statuses', value: '' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
]

export default function UserModule() {
  const { can, user: me } = useSession()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [roleId, setRoleId] = useState('')
  const [status, setStatus] = useState<UserStatus | ''>('')
  const [manageOpen, setManageOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const { getUsers, updateUser, deleteUser } = useUser({
    listParams: { page, limit: PAGE_SIZE, search, roleId, status },
  })
  const { getRoles } = useRole()
  const roles = getRoles.data ?? []
  const roleName = (id: string) => roles.find((r) => r.id === id)?.name ?? '—'

  const canCreate = can('user', 'create')
  const canUpdate = can('user', 'update')
  const canDelete = can('user', 'delete')

  const confirmDelete = () => {
    if (!deleteTarget) return
    deleteUser.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null)
        if ((getUsers.data?.users.length ?? 0) === 1 && page > 1) setPage(page - 1)
      },
    })
  }

  const toggleStatus = (u: User) => {
    setTogglingId(u.id)
    updateUser.mutate(
      { id: u.id, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' },
      { onSettled: () => setTogglingId(null) },
    )
  }

  const columns: TableColumn<User>[] = [
    { key: 'serial', header: '#', width: '56px', render: (_r, i) => (page - 1) * PAGE_SIZE + i + 1 },
    {
      key: 'name',
      header: 'User',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div className="min-w-0">
            <div className="truncate font-medium text-heading">
              {row.name}
              {row.id === me?.id && <span className="ml-2 text-xs font-normal text-body">(you)</span>}
            </div>
            <div className="truncate text-xs text-body">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (row) => (
        <span className="rounded-full bg-accent-bg px-2.5 py-0.5 text-xs font-medium text-accent">
          {roleName(row.roleId)}
        </span>
      ),
    },
    { key: 'createdAt', header: 'Added', render: (row) => formatDate(row.createdAt) },
    {
      key: 'status',
      header: 'Active',
      width: '90px',
      render: (row) => (
        <ToggleButton
          size="sm"
          checked={row.status === 'ACTIVE'}
          loading={togglingId === row.id}
          disabled={!canUpdate}
          onChange={() => toggleStatus(row)}
          label={`Toggle active for ${row.name}`}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      width: '110px',
      render: (row) => (
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
        title="Users"
        description="Add team members and assign them a role."
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
              Add User
            </Button>
          )
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="w-full sm:w-64">
          <TextField
            size="sm"
            placeholder="Search by name or email"
            leftIcon={<FiSearch size={14} />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <Dropdown
          size="sm"
          className="sm:w-44"
          fullWidth={false}
          options={[{ label: 'All roles', value: '' }, ...roles.map((r) => ({ label: r.name, value: r.id }))]}
          value={roleId}
          onChange={(v) => {
            setRoleId(v)
            setPage(1)
          }}
        />
        <Dropdown
          size="sm"
          className="sm:w-36"
          fullWidth={false}
          options={STATUS_FILTER}
          value={status}
          onChange={(v) => {
            setStatus(v as UserStatus | '')
            setPage(1)
          }}
        />
      </div>

      {updateUser.isError && (
        <Typography variant="body-sm" className="mb-3 text-red-500">
          {getErrorMessage(updateUser.error)}
        </Typography>
      )}

      <Table
        columns={columns}
        data={getUsers.data?.users ?? []}
        rowKey={(row) => row.id}
        loading={getUsers.isLoading}
        emptyMessage="No users found."
        pagination
        page={page}
        onPageChange={setPage}
        pageSize={PAGE_SIZE}
        totalItems={getUsers.data?.meta.totalRecords ?? 0}
      />

      <ManageUserModal open={manageOpen} onClose={() => setManageOpen(false)} user={editing} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete User"
        message={
          deleteUser.isError
            ? getErrorMessage(deleteUser.error)
            : `Are you sure you want to delete "${deleteTarget?.name}"? They will no longer be able to sign in.`
        }
        loading={deleteUser.isPending}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteTarget(null)
          deleteUser.reset()
        }}
      />
    </div>
  )
}
