import { useState } from 'react'
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi'
import { Button, ConfirmDialog, Table, type TableColumn } from '../../../components'
import { useBlogCategory, type BlogCategory } from '../../../services'
import { useSession } from '../../../hooks'
import { ModuleHeader } from '../common'
import ManageCategoryModal from './manage'

export default function CategoriesModule() {
  const { can } = useSession()
  const [manageOpen, setManageOpen] = useState(false)
  const [editing, setEditing] = useState<BlogCategory | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<BlogCategory | null>(null)
  const { getCategories, deleteCategory } = useBlogCategory()

  const columns: TableColumn<BlogCategory>[] = [
    { key: 'serial', header: '#', width: '56px', render: (_row, i) => i + 1 },
    { key: 'name', header: 'Category' },
    { key: 'slug', header: 'Slug' },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      width: '110px',
      render: (row) => (
        <div className="flex justify-end gap-1">
          {can('blog_category', 'update') && (
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
          {can('blog_category', 'delete') && (
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
        title="Categories"
        description="Group blogs so visitors can filter them on the website."
        action={
          can('blog_category', 'create') && (
          <Button
            size="sm"
            leftIcon={<FiPlus size={16} />}
            onClick={() => {
              setEditing(null)
              setManageOpen(true)
            }}
          >
            Add Category
          </Button>
          )
        }
      />
      <Table
        columns={columns}
        data={getCategories.data ?? []}
        rowKey={(row) => row.id}
        loading={getCategories.isLoading}
        emptyMessage="No categories added yet."
      />
      <ManageCategoryModal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        category={editing}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Blogs using it will need a new category.`}
        loading={deleteCategory.isPending}
        onConfirm={() =>
          deleteTarget &&
          deleteCategory.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
