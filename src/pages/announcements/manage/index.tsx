import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import dayjs from 'dayjs'
import { Button, Dropdown, Modal, TextField, ToggleButton, Typography } from '../../../components'
import { getErrorMessage } from '../../../lib'
import { useAnnouncement, type Announcement } from '../../../services'
import { announcementSchema, type AnnouncementFormValues } from './validations'

type Props = {
  open: boolean
  onClose: () => void
  /** Pass an announcement to edit it; omit for create. */
  announcement?: Announcement | null
}

const TYPE_OPTIONS = [
  { label: 'Popup (shown once per visit)', value: 'POPUP' },
  { label: 'Top banner (always visible)', value: 'BANNER' },
]

const emptyValues = (): AnnouncementFormValues => ({
  badge: '',
  title: '',
  message: '',
  type: 'POPUP',
  eventDate: '',
  venue: '',
  ctaLabel: '',
  ctaUrl: '',
  image: '',
  startDate: dayjs().format('YYYY-MM-DD'),
  endDate: dayjs().add(30, 'day').format('YYYY-MM-DD'),
  isActive: true,
})

const textareaClass =
  'w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-heading outline-none transition-colors placeholder:text-body/60 focus:border-accent'

export default function ManageAnnouncementModal({ open, onClose, announcement }: Props) {
  const isEdit = Boolean(announcement)
  const { createAnnouncement, updateAnnouncement } = useAnnouncement()
  const mutation = isEdit ? updateAnnouncement : createAnnouncement

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors },
  } = useForm<AnnouncementFormValues>({
    defaultValues: emptyValues(),
    resolver: joiResolver(announcementSchema),
  })

  useEffect(() => {
    if (!open) return
    reset(announcement ? { ...announcement } : emptyValues())
    mutation.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, announcement])

  const messageLength = watch('message')?.length ?? 0

  const onSubmit = (values: AnnouncementFormValues) => {
    // The button needs both a label and a link — or neither.
    if (values.ctaLabel && !values.ctaUrl) {
      setError('ctaUrl', { message: 'Add the link this button opens' })
      return
    }
    if (values.ctaUrl && !values.ctaLabel) {
      setError('ctaLabel', { message: 'Add the button text' })
      return
    }
    if (isEdit && announcement) {
      updateAnnouncement.mutate({ id: announcement.id, ...values }, { onSuccess: onClose })
    } else {
      createAnnouncement.mutate(values, { onSuccess: onClose })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={isEdit ? 'Edit Announcement' : 'Add Announcement'}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button size="sm" loading={mutation.isPending} onClick={handleSubmit(onSubmit)}>
            {isEdit ? 'Save Changes' : 'Create Announcement'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        {mutation.isError && (
          <Typography variant="body-sm" className="text-red-500">
            {getErrorMessage(mutation.error)}
          </Typography>
        )}

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Dropdown
              label="Display as"
              required
              options={TYPE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Badge"
            placeholder="e.g. Bharat Dreamin' 2026"
            helperText="Small label above the headline."
            error={errors.badge?.message}
            {...register('badge')}
          />
          <TextField
            label="Headline"
            placeholder="e.g. Meet Team Synexc in Jaipur"
            required
            error={errors.title?.message}
            {...register('title')}
          />
        </div>

        <div>
          <label htmlFor="an-message" className="mb-1.5 block text-sm font-medium text-heading">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="an-message"
            rows={3}
            placeholder="One or two sentences visitors will read."
            className={textareaClass}
            {...register('message')}
          />
          <div className="mt-1 flex justify-between text-xs">
            <span className="text-red-500">{errors.message?.message}</span>
            <span className={messageLength > 250 ? 'text-red-500' : 'text-body'}>{messageLength}/250</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Event date" type="date" error={errors.eventDate?.message} {...register('eventDate')} />
          <TextField
            label="Venue"
            placeholder="e.g. RIC, Jaipur, Rajasthan"
            error={errors.venue?.message}
            {...register('venue')}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Button text"
            placeholder="e.g. See You at Jaipur"
            error={errors.ctaLabel?.message}
            {...register('ctaLabel')}
          />
          <TextField
            label="Button link"
            placeholder="https://..."
            error={errors.ctaUrl?.message}
            {...register('ctaUrl')}
          />
        </div>

        <TextField
          label="Logo / image URL"
          placeholder="https://..."
          error={errors.image?.message}
          {...register('image')}
        />

        <div className="rounded-lg border border-border bg-surface-2 p-3">
          <p className="mb-3 text-sm font-medium text-heading">When should it show?</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Show from" type="date" required error={errors.startDate?.message} {...register('startDate')} />
            <TextField label="Show until" type="date" required error={errors.endDate?.message} {...register('endDate')} />
          </div>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <label className="mt-3 flex items-center gap-3 text-sm text-heading">
                <ToggleButton size="sm" checked={field.value} onChange={field.onChange} label="Active" />
                Active — turn off to hide it without deleting
              </label>
            )}
          />
        </div>
      </form>
    </Modal>
  )
}
