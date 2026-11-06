import { useState, type ReactNode } from 'react'
import { FiArrowDown, FiArrowUp, FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi'
import {
  Button,
  ConfirmDialog,
  ModuleHeader,
  Table,
  ToggleButton,
  Typography,
  type TableColumn,
} from '../../components'
import { useSession } from '../../hooks'
import { getErrorMessage } from '../../lib'
import type { ContentCollectionHook, ContentItem } from '../../services'

export type ManageModalProps<T> = {
  open: boolean
  onClose: () => void
  /** The item being edited; null when creating. */
  item: T | null
}

type ContentListProps<T extends ContentItem, I extends { isActive: boolean }> = {
  /** Permission subject, e.g. "testimonial" (read/create/update/delete). */
  subject: string
  title: string
  description: string
  addLabel: string
  emptyMessage: string
  useCollection: ContentCollectionHook<T, I>
  /** Columns between "#" and the Active / Actions columns. */
  columns: TableColumn<T>[]
  itemName: (item: T) => string
  Manage: (props: ManageModalProps<T>) => ReactNode
  /** Show up/down arrows (default true). Turn off for lists where order does not matter. */
  reorderable?: boolean
  /** Show the Visible toggle column (default true). */
  toggleable?: boolean
}

/** Shared list screen for the ordered website lists: reorder, toggle, edit, delete. */
export function ContentList<T extends ContentItem, I extends { isActive: boolean } = Omit<T, 'id'>>({
  subject,
  title,
  description,
  addLabel,
  emptyMessage,
  useCollection,
  columns,
  itemName,
  Manage,
  reorderable = true,
  toggleable = true,
}: ContentListProps<T, I>) {
  const { can } = useSession()
  const { getItems, updateItem, deleteItem, moveItem } = useCollection()
  const [manageOpen, setManageOpen] = useState(false)
  const [editing, setEditing] = useState<T | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const items = getItems.data ?? []
  const canCreate = can(subject, 'create')
  const canUpdate = can(subject, 'update')
  const canDelete = can(subject, 'delete')

  const toggleActive = (item: T) => {
    setBusyId(item.id)
    updateItem.mutate(
      { id: item.id, isActive: !item.isActive } as unknown as Partial<I> & { id: string },
      { onSettled: () => setBusyId(null) },
    )
  }

  const visibleColumn: TableColumn<T> = {
    key: 'active',
    header: 'Visible',
    width: '84px',
    render: (row) => (
      <ToggleButton
        size="sm"
        checked={row.isActive}
        loading={busyId === row.id}
        disabled={!canUpdate}
        onChange={() => toggleActive(row)}
        label={`Toggle visibility for ${itemName(row)}`}
      />
    ),
  }

  const allColumns: TableColumn<T>[] = [
    { key: 'serial', header: '#', width: '48px', render: (_r, i) => i + 1 },
    ...columns,
    ...(toggleable ? [visibleColumn] : []),
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      width: reorderable ? '150px' : '90px',
      render: (row, index) => (
        <div className="flex justify-end gap-0.5">
          {canUpdate && reorderable && (
            <>
              <IconBtn
                label={`Move ${itemName(row)} up`}
                disabled={index === 0 || moveItem.isPending}
                onClick={() => moveItem.mutate({ id: row.id, direction: 'up' })}
              >
                <FiArrowUp size={15} />
              </IconBtn>
              <IconBtn
                label={`Move ${itemName(row)} down`}
                disabled={index === items.length - 1 || moveItem.isPending}
                onClick={() => moveItem.mutate({ id: row.id, direction: 'down' })}
              >
                <FiArrowDown size={15} />
              </IconBtn>
            </>
          )}
          {canUpdate && (
            <IconBtn
              label={`Edit ${itemName(row)}`}
              onClick={() => {
                setEditing(row)
                setManageOpen(true)
              }}
            >
              <FiEdit2 size={15} />
            </IconBtn>
          )}
          {canDelete && (
            <IconBtn label={`Delete ${itemName(row)}`} danger onClick={() => setDeleteTarget(row)}>
              <FiTrash2 size={15} />
            </IconBtn>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <ModuleHeader
        title={title}
        description={description}
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
              {addLabel}
            </Button>
          )
        }
      />

      {reorderable && (
      <Typography variant="caption" color="body" className="mb-3 block">
        Items appear on the website in this order. Use the arrows to reorder.
      </Typography>
      )}

      {(updateItem.isError || moveItem.isError) && (
        <Typography variant="body-sm" className="mb-3 text-red-500">
          {getErrorMessage(updateItem.error ?? moveItem.error)}
        </Typography>
      )}

      <Table
        columns={allColumns}
        data={items}
        rowKey={(row) => row.id}
        loading={getItems.isLoading}
        emptyMessage={emptyMessage}
      />

      <Manage open={manageOpen} onClose={() => setManageOpen(false)} item={editing} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Delete ${addLabel.replace(/^Add /, '')}`}
        message={`Are you sure you want to delete "${deleteTarget ? itemName(deleteTarget) : ''}"? This action cannot be undone.`}
        loading={deleteItem.isPending}
        onConfirm={() =>
          deleteTarget && deleteItem.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

function IconBtn({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  danger?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg p-2 text-body transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent ${
        danger ? 'hover:text-red-500' : 'hover:text-heading'
      }`}
    >
      {children}
    </button>
  )
}
