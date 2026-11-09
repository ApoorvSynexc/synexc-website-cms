import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  getAnnouncementState,
  useAnnouncement,
  type Announcement,
  type AnnouncementState,
  type AnnouncementType,
} from '../../services'
import { formatDate } from '../../utils/date'
import ManageAnnouncementModal from './manage'

const PAGE_SIZE = 10

const TYPE_FILTER = [
  { label: 'All types', value: '' },
  { label: 'Popup', value: 'POPUP' },
  { label: 'Top banner', value: 'BANNER' },
]

const STATE_STYLE: Record<AnnouncementState, { label: string; className: string }> = {
  LIVE: { label: 'Live', className: 'bg-emerald-500/10 text-emerald-600' },
  SCHEDULED: { label: 'Scheduled', className: 'bg-sky-500/10 text-sky-600' },
  EXPIRED: { label: 'Expired', className: 'bg-slate-500/10 text-slate-500' },
  INACTIVE: { label: 'Off', className: 'bg-amber-500/10 text-amber-600' },
}

export default function AnnouncementsPage() {
  const { can } = useSession()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [type, setType] = useState<AnnouncementType | ''>('')
  // Dashboard quick actions link here with ?new=1 to open the create form straight away.
  const [searchParams, setSearchParams] = useSearchParams()
  const [manageOpen, setManageOpen] = useState(() => searchParams.get('new') === '1')
  useEffect(() => {
    if (searchParams.has('new')) setSearchParams({}, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [editing, setEditing] = useState<Announcement | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const { getAnnouncements, updateAnnouncement, deleteAnnouncement } = useAnnouncement({
    listParams: { page, limit: PAGE_SIZE, search, type },
  })

  const canCreate = can('announcement', 'create')
  const canUpdate = can('announcement', 'update')
  const canDelete = can('announcement', 'delete')

  const confirmDelete = () => {
    if (!deleteTarget) return
    deleteAnnouncement.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null)
        if ((getAnnouncements.data?.announcements.length ?? 0) === 1 && page > 1) setPage(page - 1)
      },
    })
  }

  const toggleActive = (row: Announcement) => {
    setTogglingId(row.id)
    updateAnnouncement.mutate(
      { id: row.id, isActive: !row.isActive },
      { onSettled: () => setTogglingId(null) },
    )
  }

  const columns: TableColumn<Announcement>[] = [
    { key: 'serial', header: '#', width: '56px', render: (_r, i) => (page - 1) * PAGE_SIZE + i + 1 },
    {
      key: 'title',
      header: 'Announcement',
      render: (row) => (
        <div className="min-w-0">
          <div className="max-w-sm truncate font-medium text-heading">{row.title}</div>
          <div className="max-w-sm truncate text-xs text-body">
            {[row.badge, row.venue].filter(Boolean).join(' · ') || row.message}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (row) => (row.type === 'POPUP' ? 'Popup' : 'Top banner'),
    },
    {
      key: 'window',
      header: 'Shows',
      render: (row) => `${formatDate(row.startDate)} – ${formatDate(row.endDate)}`,
    },
    {
      key: 'state',
      header: 'Status',
      render: (row) => {
        const s = STATE_STYLE[getAnnouncementState(row)]
        return (
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.className}`}>{s.label}</span>
        )
      },
    },
    {
      key: 'active',
      header: 'Active',
      width: '90px',
      render: (row) => (
        <ToggleButton
          size="sm"
          checked={row.isActive}
          loading={togglingId === row.id}
          disabled={!canUpdate}
          onChange={() => toggleActive(row)}
          label={`Toggle active for ${row.title}`}
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
        <Typography variant="h5">Announcements</Typography>
        <Typography variant="body-sm" color="body" className="mt-0.5">
          Event popups and top banners shown on the Synexc website.
        </Typography>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-border bg-surface p-5">
        <ModuleHeader
          title="All announcements"
          description="Schedule an event announcement once — it appears and disappears on its own dates."
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
                Add Announcement
              </Button>
            )
          }
        />

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="w-full sm:w-64">
            <TextField
              size="sm"
              placeholder="Search announcements"
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
            className="sm:w-40"
            fullWidth={false}
            options={TYPE_FILTER}
            value={type}
            onChange={(v) => {
              setType(v as AnnouncementType | '')
              setPage(1)
            }}
          />
        </div>

        {updateAnnouncement.isError && (
          <Typography variant="body-sm" className="mb-3 text-red-500">
            {getErrorMessage(updateAnnouncement.error)}
          </Typography>
        )}

        <Table
          columns={columns}
          data={getAnnouncements.data?.announcements ?? []}
          rowKey={(row) => row.id}
          loading={getAnnouncements.isLoading}
          emptyMessage="No announcements yet."
          pagination
          page={page}
          onPageChange={setPage}
          pageSize={PAGE_SIZE}
          totalItems={getAnnouncements.data?.meta.totalRecords ?? 0}
        />
      </div>

      <ManageAnnouncementModal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        announcement={editing}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Announcement"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        loading={deleteAnnouncement.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
