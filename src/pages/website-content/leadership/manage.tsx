import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { Button, Modal, TextField, ToggleButton, Typography, ImageUpload } from '../../../components'
import { getErrorMessage } from '../../../lib'
import { useLeadership, type TeamMember, type TeamMemberInput } from '../../../services'
import type { ManageModalProps } from '../ContentList'
import { teamMemberSchema, type TeamMemberFormValues } from './validations'

const empty = (): TeamMemberFormValues => ({
  name: '',
  role: '',
  bio: '',
  photo: null,
  linkedin: '',
  email: '',
  isActive: true,
})

const toFormValues = (item: TeamMember): TeamMemberFormValues => ({
  name: item.name,
  role: item.role,
  bio: item.bio,
  photo: item.photo,
  linkedin: item.linkedin,
  email: item.email,
  isActive: item.isActive,
})

const toPayload = (v: TeamMemberFormValues): TeamMemberInput => ({
  name: v.name,
  role: v.role,
  bio: v.bio,
  photoId: v.photo?.id ?? null,
  linkedin: v.linkedin,
  email: v.email,
  isActive: v.isActive,
})

export default function ManageLeadershipModal({ open, onClose, item }: ManageModalProps<TeamMember>) {
  const isEdit = Boolean(item)
  const { createItem, updateItem } = useLeadership()
  const mutation = isEdit ? updateItem : createItem

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TeamMemberFormValues>({ defaultValues: empty(), resolver: joiResolver(teamMemberSchema) })

  useEffect(() => {
    if (!open) return
    reset(item ? toFormValues(item) : empty())
    mutation.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, item])

  const bioLength = watch('bio')?.length ?? 0

  const onSubmit = (values: TeamMemberFormValues) => {
    if (isEdit && item) updateItem.mutate({ id: item.id, ...toPayload(values) }, { onSuccess: onClose })
    else createItem.mutate(toPayload(values), { onSuccess: onClose })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Team Member' : 'Add Team Member'}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button size="sm" loading={mutation.isPending} onClick={handleSubmit(onSubmit)}>
            {isEdit ? 'Save Changes' : 'Add Member'}
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

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Name" placeholder="e.g. Anjali Gupta" required error={errors.name?.message} {...register('name')} />
          <TextField
            label="Job title"
            placeholder="e.g. Head of Client Success"
            required
            error={errors.role?.message}
            {...register('role')}
          />
        </div>

        <div>
          <label htmlFor="ld-bio" className="mb-1.5 block text-sm font-medium text-heading">
            Short bio <span className="text-red-500">*</span>
          </label>
          <textarea
            id="ld-bio"
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-heading outline-none transition-colors placeholder:text-body/60 focus:border-accent"
            {...register('bio')}
          />
          <div className="mt-1 flex justify-between text-xs">
            <span className="text-red-500">{errors.bio?.message}</span>
            <span className={bioLength > 300 ? 'text-red-500' : 'text-body'}>{bioLength}/300</span>
          </div>
        </div>

        <Controller
          name="photo"
          control={control}
          render={({ field }) => (
            <ImageUpload
              label="Photo (optional)"
              helperText="Without a photo the website shows the person's initial."
              value={field.value}
              onChange={field.onChange}
              error={errors.photo?.message as string | undefined}
            />
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="LinkedIn (optional)"
            placeholder="https://www.linkedin.com/in/…"
            error={errors.linkedin?.message}
            {...register('linkedin')}
          />
          <TextField
            label="Email (optional)"
            type="email"
            placeholder="name@synexc.com"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <label className="flex items-center gap-3 text-sm text-heading">
              <ToggleButton size="sm" checked={field.value} onChange={field.onChange} label="Visible" />
              Visible on the website
            </label>
          )}
        />
      </form>
    </Modal>
  )
}
