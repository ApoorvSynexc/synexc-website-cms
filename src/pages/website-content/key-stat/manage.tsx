import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { Button, Dropdown, Modal, TextField, ToggleButton, Typography } from '../../../components'
import { getErrorMessage } from '../../../lib'
import { KEY_STAT_ICONS, useKeyStat, type KeyStat } from '../../../services'
import type { ManageModalProps } from '../ContentList'
import { keyStatSchema, type KeyStatFormValues } from './validations'

const ICON_OPTIONS = KEY_STAT_ICONS.map((i) => ({ label: i.label, value: i.value }))

const empty = (): KeyStatFormValues => ({ stat: '', title: '', description: '', icon: '', isActive: true })

export default function ManageKeyStatModal({ open, onClose, item }: ManageModalProps<KeyStat>) {
  const isEdit = Boolean(item)
  const { createItem, updateItem } = useKeyStat()
  const mutation = isEdit ? updateItem : createItem

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<KeyStatFormValues>({ defaultValues: empty(), resolver: joiResolver(keyStatSchema) })

  useEffect(() => {
    if (!open) return
    reset(item ? { ...item } : empty())
    mutation.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, item])

  const descLength = watch('description')?.length ?? 0

  const onSubmit = (values: KeyStatFormValues) => {
    if (isEdit && item) updateItem.mutate({ id: item.id, ...values }, { onSuccess: onClose })
    else createItem.mutate(values, { onSuccess: onClose })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Key Stat' : 'Add Key Stat'}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button size="sm" loading={mutation.isPending} onClick={handleSubmit(onSubmit)}>
            {isEdit ? 'Save Changes' : 'Create Stat'}
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
            label="Figure"
            placeholder="100+"
            helperText="Animates up to this number."
            required
            error={errors.stat?.message}
            {...register('stat')}
          />
          <div className="sm:col-span-2">
            <TextField
              label="Title"
              placeholder="e.g. Expert Talent Pool"
              required
              error={errors.title?.message}
              {...register('title')}
            />
          </div>
        </div>

        <div>
          <label htmlFor="ks-desc" className="mb-1.5 block text-sm font-medium text-heading">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="ks-desc"
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-heading outline-none transition-colors placeholder:text-body/60 focus:border-accent"
            {...register('description')}
          />
          <div className="mt-1 flex justify-between text-xs">
            <span className="text-red-500">{errors.description?.message}</span>
            <span className={descLength > 200 ? 'text-red-500' : 'text-body'}>{descLength}/200</span>
          </div>
        </div>

        <Controller
          name="icon"
          control={control}
          render={({ field }) => (
            <Dropdown
              label="Icon"
              placeholder="Choose an icon"
              required
              options={ICON_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.icon?.message}
            />
          )}
        />

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
