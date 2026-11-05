import { useState } from 'react'
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi'
import {
  Button,
  ConfirmDialog,
  Dropdown,
  Table,
  TextField,
  ToggleButton,
  type TableColumn,
} from '../../components'
import { useBlog, useBlogCategory, type Blog, type BlogStatus } from '../../services'
import { useSession } from '../../hooks'
import { formatDate } from '../../utils/date'
import { ModuleHeader } from './common'
import ManageBlogModal from './manage'

const PAGE_SIZE = 10

const STATUS_FILTER = [
  { label: 'All statuses', value: '' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Draft', value: 'DRAFT' },
]

export default function PostsModule() {
  const { can } = useSession()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState<BlogStatus | ''>('')
  const [manageOpen, setManageOpen] = useState(false)
  const [editing, setEditing] = useState<Blog | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const { getBlogs, updateBlog, deleteBlog } = useBlog({
    listParams: { page, limit: PAGE_SIZE, search, categoryId, status },
  })
  const { getCategories } = useBlogCategory()
  const categories = getCategories.data ?? []
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? '—'

  const openCreate = () => {
    setEditing(null)
    setManageOpen(true)
  }
  const openEdit = (blog: Blog) => {
    setEditing(blog)
    setManageOpen(true)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    deleteBlog.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null)
        // Deleting the last row on a page would otherwise leave an empty page.
        if ((getBlogs.data?.blogs.length ?? 0) === 1 && page > 1) setPage(page - 1)
      },
    })
  }

  const toggleStatus = (blog: Blog) => {
    setTogglingId(blog.id)
    updateBlog.mutate(
      { id: blog.id, status: blog.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' },
      { onSettled: () => setTogglingId(null) },
    )
  }

  const columns: TableColumn<Blog>[] = [
    {
      key: 'serial',
      header: '#',
      width: '56px',
      render: (_row, index) => (page - 1) * PAGE_SIZE + index + 1,
    },
    {
      key: 'title',
      header: 'Title',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.featuredImage ? (
            <img src={row.featuredImage} alt="" className="h-10 w-14 rounded-md object-cover" />
          ) : (
            <div className="flex h-10 w-14 items-center justify-center rounded-md bg-surface-2 text-xs font-bold text-body">
              S
            </div>
          )}
          <div className="min-w-0">
            <div className="truncate font-medium text-heading">{row.title}</div>
            <div className="truncate text-xs text-body">/blog/{row.slug}</div>
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: (row) => categoryName(row.categoryId) },
    { key: 'author', header: 'Author' },
    { key: 'publishedAt', header: 'Date', render: (row) => formatDate(row.publishedAt) },
    {
      key: 'status',
      header: 'Published',
      width: '110px',
      render: (row) => (
        <ToggleButton
          size="sm"
          checked={row.status === 'PUBLISHED'}
          loading={togglingId === row.id}
          disabled={!can('blog', 'update')}
          onChange={() => toggleStatus(row)}
          label={`Toggle published for ${row.title}`}
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
          {can('blog', 'update') && (
          <button
            type="button"
            aria-label={`Edit ${row.title}`}
            onClick={() => openEdit(row)}
            className="rounded-lg p-2 text-body transition-colors hover:bg-surface-2 hover:text-heading"
          >
            <FiEdit2 size={15} />
          </button>
          )}
          {can('blog', 'delete') && (
          <button
            type="button"
            aria-label={`Delete ${row.title}`}
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
        title="Blogs"
        description="Create, edit and publish the articles shown on the Synexc website."
        action={
          can('blog', 'create') && (
          <Button size="sm" leftIcon={<FiPlus size={16} />} onClick={openCreate}>
            Add Blog
          </Button>
          )
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="w-full sm:w-64">
          <TextField
            size="sm"
            placeholder="Search by title or author"
            leftIcon={<FiSearch size={14} />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <Dropdown
          className="sm:w-44"
          fullWidth={false}
          size="sm"
          options={[
            { label: 'All categories', value: '' },
            ...categories.map((c) => ({ label: c.name, value: c.id })),
          ]}
          value={categoryId}
          onChange={(v) => {
            setCategoryId(v)
            setPage(1)
          }}
        />
        <Dropdown
          className="sm:w-36"
          fullWidth={false}
          size="sm"
          options={STATUS_FILTER}
          value={status}
          onChange={(v) => {
            setStatus(v as BlogStatus | '')
            setPage(1)
          }}
        />
      </div>

      <Table
        columns={columns}
        data={getBlogs.data?.blogs ?? []}
        rowKey={(row) => row.id}
        loading={getBlogs.isLoading}
        emptyMessage="No blogs found."
        pagination
        page={page}
        onPageChange={setPage}
        pageSize={PAGE_SIZE}
        totalItems={getBlogs.data?.meta.totalRecords ?? 0}
      />

      <ManageBlogModal open={manageOpen} onClose={() => setManageOpen(false)} blog={editing} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Blog"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        loading={deleteBlog.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
