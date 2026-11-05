import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { Button, Dropdown, Modal, TextField, ToggleButton, Typography } from '../../../components'
import { getErrorMessage } from '../../../lib'
import { usePartnerLogo, type PartnerLogo } from '../../../services'
import type { ManageModalProps } from '../ContentList'
import { ImagePreview } from '../shared'
import { partnerLogoSchema, type PartnerLogoFormValues } from './validations'

const PLACEMENT_OPTIONS = [
  { label: 'Trusted partners strip', value: 'PARTNER' },
  { label: 'Client logos', value: 'CLIENT' },
]

const empty = (): PartnerLogoFormValues => ({
  name: '',
  logo: '',
  link: '',
  placement: 'PARTNER',
  isActive: true,
})

export default function ManagePartnerLogoModal({ open, onClose, item }: ManageModalProps<PartnerLogo>) {
  const isEdit = Boolean(item)
  const { createItem, updateItem } = usePartnerLogo()
  const mutation = isEdit ? updateItem : createItem

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PartnerLogoFormValues>({ defaultValues: empty(), resolver: joiResolver(partnerLogoSchema) })

  useEffect(() => {
    if (!open) return
    reset(item ? { ...item } : empty())
    mutation.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, item])

  const logo = watch('logo')

  const onSubmit = (values: PartnerLogoFormValues) => {
    if (isEdit && item) updateItem.mutate({ id: item.id, ...values }, { onSuccess: onClose })
    else createItem.mutate(values, { onSuccess: onClose })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Logo' : 'Add Logo'}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button size="sm" loading={mutation.isPending} onClick={handleSubmit(onSubmit)}>
            {isEdit ? 'Save Changes' : 'Add Logo'}
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

        <TextField label="Name" placeholder="e.g. Salesforce" required error={errors.name?.message} {...register('name')} />

        <div>
          <TextField
            label="Logo"
            placeholder="https://… or /client-logo/name.png"
            required
            error={errors.logo?.message}
            {...register('logo')}
          />
          {!errors.logo && <ImagePreview src={logo} />}
        </div>

        <TextField
          label="Link (optional)"
          placeholder="https://…"
          error={errors.link?.message}
          {...register('link')}
        />

        <Controller
          name="placement"
          control={control}
          render={({ field }) => (
            <Dropdown
              label="Shown in"
              required
              options={PLACEMENT_OPTIONS}
              value={field.value}
              onChange={field.onChange}
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
