import { useState } from 'react'
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi'
import {
  Button,
  ConfirmDialog,
  Dropdown,
  ModuleHeader,
  Table,
  TextField,
  ToggleButton,
  Typography,
  type TableColumn,
} from '../../components'
import { useSession } from '../../hooks'
import { getErrorMessage } from '../../lib'
import {
  CASE_STUDY_CATEGORIES,
  useCaseStudy,
  type CaseStudy,
  type CaseStudyStatus,
} from '../../services'
import { formatDate } from '../../utils/date'
import ManageCaseStudyModal from './manage'

const PAGE_SIZE = 10

const CATEGORY_FILTER = [
  { label: 'All categories', value: '' },
  ...CASE_STUDY_CATEGORIES.map((c) => ({ label: c, value: c })),
]

const STATUS_FILTER = [
  { label: 'All statuses', value: '' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Draft', value: 'DRAFT' },
]

export default function CaseStudiesPage() {
  const { can } = useSession()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState<CaseStudyStatus | ''>('')
  const [manageOpen, setManageOpen] = useState(false)
  const [editing, setEditing] = useState<CaseStudy | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CaseStudy | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const { getCaseStudies, updateCaseStudy, deleteCaseStudy } = useCaseStudy({
    listParams: { page, limit: PAGE_SIZE, search, category, status },
  })

  const canCreate = can('case_study', 'create')
  const canUpdate = can('case_study', 'update')
  const canDelete = can('case_study', 'delete')

  const confirmDelete = () => {
    if (!deleteTarget) return
    deleteCaseStudy.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null)
        if ((getCaseStudies.data?.caseStudies.length ?? 0) === 1 && page > 1) setPage(page - 1)
      },
    })
  }

  const toggleStatus = (row: CaseStudy) => {
    setTogglingId(row.id)
    updateCaseStudy.mutate(
      { id: row.id, status: row.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' },
      { onSettled: () => setTogglingId(null) },
    )
  }

  const columns: TableColumn<CaseStudy>[] = [
    { key: 'serial', header: '#', width: '56px', render: (_r, i) => (page - 1) * PAGE_SIZE + i + 1 },
    {
      key: 'title',
      header: 'Case study',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.image ? (
            <img src={row.image} alt="" className="h-10 w-14 rounded-md object-cover" />
          ) : (
            <div className="flex h-10 w-14 items-center justify-center rounded-md bg-surface-2 text-xs font-bold text-body">
              S
            </div>
          )}
          <div className="min-w-0">
            <div className="max-w-md truncate font-medium text-heading">{row.title}</div>
            <div className="truncate text-xs text-body">/case-studies/{row.slug}</div>
          </div>
        </div>
      ),
    },
    { key: 'client', header: 'Client' },
    {
      key: 'category',
      header: 'Category',
      render: (row) => (
        <span className="rounded-full bg-accent-bg px-2.5 py-0.5 text-xs font-medium text-accent">
          {row.category}
        </span>
      ),
    },
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
          disabled={!canUpdate}
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
          {canUpdate && (
            <button
              type="button"
              aria-label={`Edit ${row.title}`}
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
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="shrink-0">
        <Typography variant="h5">Case Studies</Typography>
        <Typography variant="body-sm" color="body" className="mt-0.5">
          Manage the client success stories shown on the Synexc website.
        </Typography>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-border bg-surface p-5">
        <ModuleHeader
          title="All case studies"
          description="Publish, edit or unpublish case studies without touching the website code."
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
                Add Case Study
              </Button>
            )
          }
        />

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="w-full sm:w-64">
            <TextField
              size="sm"
              placeholder="Search by title or client"
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
            className="sm:w-48"
            fullWidth={false}
            options={CATEGORY_FILTER}
            value={category}
            onChange={(v) => {
              setCategory(v)
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
              setStatus(v as CaseStudyStatus | '')
              setPage(1)
            }}
          />
        </div>

        {updateCaseStudy.isError && (
          <Typography variant="body-sm" className="mb-3 text-red-500">
            {getErrorMessage(updateCaseStudy.error)}
          </Typography>
        )}

        <Table
          columns={columns}
          data={getCaseStudies.data?.caseStudies ?? []}
          rowKey={(row) => row.id}
          loading={getCaseStudies.isLoading}
          emptyMessage="No case studies found."
          pagination
          page={page}
          onPageChange={setPage}
          pageSize={PAGE_SIZE}
          totalItems={getCaseStudies.data?.meta.totalRecords ?? 0}
        />
      </div>

      <ManageCaseStudyModal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        caseStudy={editing}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Case Study"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        loading={deleteCaseStudy.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
