import { useState } from 'react'
import { FiDownload, FiEye, FiSearch, FiTrash2 } from 'react-icons/fi'
import {
  Avatar,
  Button,
  ConfirmDialog,
  Dropdown,
  Table,
  Tabs,
  TextField,
  Typography,
  type TableColumn,
} from '../../components'
import { useSession } from '../../hooks'
import { getErrorMessage } from '../../lib'
import {
  INQUIRY_STATUSES,
  useInquiry,
  useInquiryCounts,
  useUser,
  type Inquiry,
  type InquiryStatus,
} from '../../services'
import { downloadCsv } from '../../utils/csv'
import { formatDate, fromNow } from '../../utils/date'
import InquiryDetailModal from './InquiryDetailModal'

const PAGE_SIZE = 10

const STATUS_STYLE: Record<InquiryStatus, string> = {
  NEW: 'bg-sky-500/10 text-sky-600',
  CONTACTED: 'bg-amber-500/10 text-amber-600',
  QUALIFIED: 'bg-emerald-500/10 text-emerald-600',
  CLOSED: 'bg-slate-500/10 text-slate-500',
}

const statusLabel = (s: InquiryStatus) => INQUIRY_STATUSES.find((x) => x.value === s)?.label ?? s

export default function InquiriesPage() {
  const { can } = useSession()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<InquiryStatus | ''>('')
  const [specialization, setSpecialization] = useState('')
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null)

  const { getInquiries, deleteInquiry, exportInquiries } = useInquiry({
    listParams: { page, limit: PAGE_SIZE, search, status, specialization },
  })
  const { data: counts } = useInquiryCounts()
  const { getUsers } = useUser({ listParams: { page: 1, limit: 100 } })
  const users = getUsers.data?.users ?? []
  const assigneeName = (id: string) => users.find((u) => u.id === id)?.name

  const canUpdate = can('inquiry', 'update')
  const canDelete = can('inquiry', 'delete')

  const tabItems = [
    { key: '', label: `All (${counts?.ALL ?? 0})` },
    ...INQUIRY_STATUSES.map((s) => ({ key: s.value, label: `${s.label} (${counts?.[s.value] ?? 0})` })),
  ]

  const exportCsv = () =>
    exportInquiries.mutate(
      { search, status, specialization },
      {
        onSuccess: (rows) =>
          downloadCsv(
            `inquiries-${new Date().toISOString().slice(0, 10)}.csv`,
            ['Received', 'First name', 'Last name', 'Email', 'Phone', 'Country', 'Interested in', 'Team size', 'Status', 'Assigned to', 'Message', 'Notes'],
            rows.map((r) => [
              formatDate(r.createdAt, 'YYYY-MM-DD HH:mm'),
              r.firstName,
              r.lastName === '-' ? '' : r.lastName,
              r.email,
              `${r.dialCode.code} ${r.phone}`.trim(),
              r.dialCode.country,
              r.specialization,
              r.teamSize,
              statusLabel(r.status),
              assigneeName(r.assigneeId) ?? '',
              r.description,
              r.notes,
            ]),
          ),
      },
    )

  const confirmDelete = () => {
    if (!deleteTarget) return
    deleteInquiry.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null)
        if ((getInquiries.data?.inquiries.length ?? 0) === 1 && page > 1) setPage(page - 1)
      },
    })
  }

  const columns: TableColumn<Inquiry>[] = [
    {
      key: 'name',
      header: 'From',
      render: (row) => {
        const name = `${row.firstName} ${row.lastName === '-' ? '' : row.lastName}`.trim()
        return (
          <button type="button" onClick={() => setSelected(row)} className="flex items-center gap-3 text-left">
            <span className="relative">
              <Avatar name={name} size="sm" />
              {row.status === 'NEW' && (
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-sky-500" />
              )}
            </span>
            <span className="min-w-0">
              <span className={`block truncate text-heading ${row.status === 'NEW' ? 'font-semibold' : 'font-medium'}`}>
                {name}
              </span>
              <span className="block truncate text-xs text-body">{row.email}</span>
            </span>
          </button>
        )
      },
    },
    {
      key: 'interest',
      header: 'Interested in',
      render: (row) => (
        <div className="max-w-56">
          <div className="truncate text-heading">{row.specialization || '—'}</div>
          <div className="line-clamp-1 text-xs text-body">{row.description}</div>
        </div>
      ),
    },
    { key: 'phone', header: 'Phone', render: (row) => `${row.dialCode.code} ${row.phone}` },
    { key: 'teamSize', header: 'Team', render: (row) => row.teamSize || '—' },
    {
      key: 'createdAt',
      header: 'Received',
      render: (row) => <span title={formatDate(row.createdAt, 'DD MMM YYYY, hh:mm A')}>{fromNow(row.createdAt)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[row.status]}`}>
          {statusLabel(row.status)}
        </span>
      ),
    },
    {
      key: 'assignee',
      header: 'Assigned to',
      render: (row) => assigneeName(row.assigneeId) ?? <span className="text-body/50">Unassigned</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      width: '90px',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            aria-label={`View inquiry from ${row.firstName}`}
            onClick={() => setSelected(row)}
            className="rounded-lg p-2 text-body transition-colors hover:bg-surface-2 hover:text-heading"
          >
            <FiEye size={15} />
          </button>
          {canDelete && (
            <button
              type="button"
              aria-label={`Delete inquiry from ${row.firstName}`}
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
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-3">
        <div>
          <Typography variant="h5">Inquiries</Typography>
          <Typography variant="body-sm" color="body" className="mt-0.5">
            Leads submitted through the contact and service forms on the website.
          </Typography>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<FiDownload size={15} />}
          loading={exportInquiries.isPending}
          onClick={exportCsv}
        >
          Export CSV
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 overflow-x-auto">
          <Tabs
            variant="pill"
            active={status}
            onChange={(k) => {
              setStatus(k as InquiryStatus | '')
              setPage(1)
            }}
            items={tabItems}
          />
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="w-full sm:w-72">
            <TextField
              size="sm"
              placeholder="Search name, email, phone or message"
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
            className="sm:w-64"
            fullWidth={false}
            options={[
              { label: 'All interests', value: '' },
              ...(getInquiries.data?.specializations ?? []).map((s) => ({ label: s, value: s })),
            ]}
            value={specialization}
            onChange={(v) => {
              setSpecialization(v)
              setPage(1)
            }}
          />
        </div>

        {exportInquiries.isError && (
          <Typography variant="body-sm" className="mb-3 text-red-500">
            {getErrorMessage(exportInquiries.error)}
          </Typography>
        )}

        <Table
          columns={columns}
          data={getInquiries.data?.inquiries ?? []}
          rowKey={(row) => row.id}
          loading={getInquiries.isLoading}
          emptyMessage="No inquiries match your filters."
          pagination
          page={page}
          onPageChange={setPage}
          pageSize={PAGE_SIZE}
          totalItems={getInquiries.data?.meta.totalRecords ?? 0}
        />
      </div>

      <InquiryDetailModal inquiry={selected} onClose={() => setSelected(null)} canEdit={canUpdate} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Inquiry"
        message={`Delete the inquiry from ${deleteTarget?.firstName ?? ''} ${deleteTarget?.lastName === '-' ? '' : (deleteTarget?.lastName ?? '')}? This permanently removes the lead.`}
        loading={deleteInquiry.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
