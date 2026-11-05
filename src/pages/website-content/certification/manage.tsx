import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { Button, Dropdown, Modal, TextField, ToggleButton, Typography } from '../../../components'
import { getErrorMessage } from '../../../lib'
import { CERTIFICATION_ICONS, useCertification, type Certification } from '../../../services'
import type { ManageModalProps } from '../ContentList'
import { certificationSchema, type CertificationFormValues } from './validations'

const ICON_OPTIONS = CERTIFICATION_ICONS.map((i) => ({ label: i.label, value: i.value }))

const empty = (): CertificationFormValues => ({
  title: '',
  type: '',
  description: '',
  icon: '',
  isActive: true,
})

export default function ManageCertificationModal({ open, onClose, item }: ManageModalProps<Certification>) {
  const isEdit = Boolean(item)
  const { createItem, updateItem } = useCertification()
  const mutation = isEdit ? updateItem : createItem

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CertificationFormValues>({ defaultValues: empty(), resolver: joiResolver(certificationSchema) })

  useEffect(() => {
    if (!open) return
    reset(item ? { ...item } : empty())
    mutation.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, item])

  const descLength = watch('description')?.length ?? 0

  const onSubmit = (values: CertificationFormValues) => {
    if (isEdit && item) updateItem.mutate({ id: item.id, ...values }, { onSuccess: onClose })
    else createItem.mutate(values, { onSuccess: onClose })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Certification' : 'Add Certification'}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button size="sm" loading={mutation.isPending} onClick={handleSubmit(onSubmit)}>
            {isEdit ? 'Save Changes' : 'Create Certification'}
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

        <TextField
          label="Title"
          placeholder="e.g. Salesforce Consulting Partner"
          required
          error={errors.title?.message}
          {...register('title')}
        />
        <TextField
          label="Sub-heading"
          placeholder="e.g. Certified Ecosystem Integration"
          required
          error={errors.type?.message}
          {...register('type')}
        />

        <div>
          <label htmlFor="cert-desc" className="mb-1.5 block text-sm font-medium text-heading">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="cert-desc"
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-heading outline-none transition-colors placeholder:text-body/60 focus:border-accent"
            {...register('description')}
          />
          <div className="mt-1 flex justify-between text-xs">
            <span className="text-red-500">{errors.description?.message}</span>
            <span className={descLength > 250 ? 'text-red-500' : 'text-body'}>{descLength}/250</span>
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
