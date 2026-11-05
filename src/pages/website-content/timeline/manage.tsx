import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { Button, Modal, TextField, ToggleButton, Typography } from '../../../components'
import { getErrorMessage } from '../../../lib'
import { useTimeline, type TimelineEvent } from '../../../services'
import type { ManageModalProps } from '../ContentList'
import { timelineSchema, type TimelineFormValues } from './validations'

const empty = (): TimelineFormValues => ({ year: '', title: '', description: '', isActive: true })

export default function ManageTimelineModal({ open, onClose, item }: ManageModalProps<TimelineEvent>) {
  const isEdit = Boolean(item)
  const { createItem, updateItem } = useTimeline()
  const mutation = isEdit ? updateItem : createItem

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TimelineFormValues>({ defaultValues: empty(), resolver: joiResolver(timelineSchema) })

  useEffect(() => {
    if (!open) return
    reset(item ? { ...item } : empty())
    mutation.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, item])

  const descLength = watch('description')?.length ?? 0

  const onSubmit = (values: TimelineFormValues) => {
    if (isEdit && item) updateItem.mutate({ id: item.id, ...values }, { onSuccess: onClose })
    else createItem.mutate(values, { onSuccess: onClose })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Milestone' : 'Add Milestone'}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button size="sm" loading={mutation.isPending} onClick={handleSubmit(onSubmit)}>
            {isEdit ? 'Save Changes' : 'Add Milestone'}
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

        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            label="Year"
            placeholder="2023"
            inputMode="numeric"
            maxLength={4}
            required
            error={errors.year?.message}
            {...register('year')}
          />
          <div className="sm:col-span-2">
            <TextField
              label="Title"
              placeholder="e.g. Intelligent Automation & AI"
              required
              error={errors.title?.message}
              {...register('title')}
            />
          </div>
        </div>

        <div>
          <label htmlFor="tl-desc" className="mb-1.5 block text-sm font-medium text-heading">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="tl-desc"
            rows={4}
            className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-heading outline-none transition-colors placeholder:text-body/60 focus:border-accent"
            {...register('description')}
          />
          <div className="mt-1 flex justify-between text-xs">
            <span className="text-red-500">{errors.description?.message}</span>
            <span className={descLength > 300 ? 'text-red-500' : 'text-body'}>{descLength}/300</span>
          </div>
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
