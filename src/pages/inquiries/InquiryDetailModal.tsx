import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { FiMail, FiMessageCircle, FiPhone } from 'react-icons/fi'
import { Avatar, Button, Dropdown, Modal, Typography } from '../../components'
import { getErrorMessage } from '../../lib'
import { INQUIRY_STATUSES, useInquiry, useUser, type Inquiry } from '../../services'
import { formatDateTime } from '../../utils/date'
import { inquirySchema, type InquiryFormValues } from './validations'

type Props = {
  inquiry: Inquiry | null
  onClose: () => void
  /** False = view only (no update permission). */
  canEdit: boolean
}

const STATUS_OPTIONS = INQUIRY_STATUSES.map((s) => ({ label: s.label, value: s.value }))

export default function InquiryDetailModal({ inquiry, onClose, canEdit }: Props) {
  const { updateInquiry } = useInquiry()
  const { getUsers } = useUser({ listParams: { page: 1, limit: 100, status: 'ACTIVE' } })

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<InquiryFormValues>({
    defaultValues: { status: 'NEW', assigneeId: '', notes: '' },
    resolver: joiResolver(inquirySchema),
  })

  useEffect(() => {
    if (!inquiry) return
    reset({ status: inquiry.status, assigneeId: inquiry.assigneeId, notes: inquiry.notes })
    updateInquiry.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inquiry])

  const notesLength = watch('notes')?.length ?? 0
  const assigneeOptions = [
    { label: 'Unassigned', value: '' },
    ...(getUsers.data?.users ?? []).map((u) => ({ label: u.name, value: u.id })),
  ]

  if (!inquiry) return null

  const fullName = `${inquiry.firstName} ${inquiry.lastName === '-' ? '' : inquiry.lastName}`.trim()
  const phoneDisplay = `${inquiry.dialCode.code} ${inquiry.phone}`.trim()
  const phoneDigits = `${inquiry.dialCode.code}${inquiry.phone}`.replace(/\D/g, '')

  const onSubmit = (values: InquiryFormValues) =>
    updateInquiry.mutate(
      { id: inquiry.id, ...values, notes: values.notes.trim() },
      { onSuccess: onClose },
    )

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title="Inquiry details"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={updateInquiry.isPending}>
            {canEdit ? 'Cancel' : 'Close'}
          </Button>
          {canEdit && (
            <Button
              size="sm"
              loading={updateInquiry.isPending}
              disabled={!isDirty}
              onClick={handleSubmit(onSubmit)}
            >
              Save Changes
            </Button>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar name={fullName} size="md" />
            <div>
              <p className="font-semibold text-heading">{fullName}</p>
              <p className="text-xs text-body">Received {formatDateTime(inquiry.createdAt)}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <ActionLink href={`mailto:${inquiry.email}`} icon={<FiMail size={14} />} label="Email" />
            <ActionLink href={`tel:+${phoneDigits}`} icon={<FiPhone size={14} />} label="Call" />
            <ActionLink
              href={`https://wa.me/${phoneDigits}`}
              icon={<FiMessageCircle size={14} />}
              label="WhatsApp"
              external
            />
          </div>
        </div>

        <dl className="grid gap-x-6 gap-y-3 rounded-lg border border-border bg-surface-2 p-4 text-sm sm:grid-cols-2">
          <Detail label="Email" value={inquiry.email} />
          <Detail
            label="Phone"
            value={`${phoneDisplay}${inquiry.dialCode.country ? ` (${inquiry.dialCode.country})` : ''}`}
          />
          <Detail label="Interested in" value={inquiry.specialization} />
          <Detail label="Team size" value={inquiry.teamSize} />
        </dl>

        <div>
          <p className="mb-1.5 text-sm font-medium text-heading">Message</p>
          <p className="whitespace-pre-wrap rounded-lg border border-border bg-surface p-3 text-sm text-body">
            {inquiry.description}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          {updateInquiry.isError && (
            <Typography variant="body-sm" className="text-red-500">
              {getErrorMessage(updateInquiry.error)}
            </Typography>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Dropdown
                  label="Status"
                  options={STATUS_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={!canEdit}
                />
              )}
            />
            <Controller
              name="assigneeId"
              control={control}
              render={({ field }) => (
                <Dropdown
                  label="Assigned to"
                  options={assigneeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={!canEdit}
                />
              )}
            />
          </div>

          <div>
            <label htmlFor="iq-notes" className="mb-1.5 block text-sm font-medium text-heading">
              Internal notes
            </label>
            <textarea
              id="iq-notes"
              rows={3}
              disabled={!canEdit}
              placeholder="Call summary, next steps… (only visible in the CMS)"
              className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-heading outline-none transition-colors placeholder:text-body/60 focus:border-accent disabled:opacity-60"
              {...register('notes')}
            />
            <div className="mt-1 flex justify-between text-xs">
              <span className="text-red-500">{errors.notes?.message}</span>
              <span className={notesLength > 1000 ? 'text-red-500' : 'text-body'}>{notesLength}/1000</span>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-body">{label}</dt>
      <dd className="mt-0.5 break-words font-medium text-heading">{value || '—'}</dd>
    </div>
  )
}

function ActionLink({
  href,
  icon,
  label,
  external,
}: {
  href: string
  icon: React.ReactNode
  label: string
  external?: boolean
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-medium text-heading transition-colors hover:bg-surface-2"
    >
      {icon}
      {label}
    </a>
  )
}
