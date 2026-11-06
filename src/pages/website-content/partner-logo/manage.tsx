import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { Button, Dropdown, Modal, TextField, ToggleButton, Typography, ImageUpload } from '../../../components'
import { getErrorMessage } from '../../../lib'
import { usePartnerLogo, type PartnerLogo, type PartnerLogoInput } from '../../../services'
import type { ManageModalProps } from '../ContentList'
import { partnerLogoSchema, type PartnerLogoFormValues } from './validations'

const PLACEMENT_OPTIONS = [
  { label: 'Trusted partners strip', value: 'PARTNER' },
  { label: 'Client logos', value: 'CLIENT' },
]

const empty = (): PartnerLogoFormValues => ({
  name: '',
  logo: null,
  link: '',
  placement: 'PARTNER',
  isActive: true,
})

const toFormValues = (item: PartnerLogo): PartnerLogoFormValues => ({
  name: item.name,
  logo: item.logo,
  link: item.link,
  placement: item.placement,
  isActive: item.isActive,
})

const toPayload = (v: PartnerLogoFormValues): PartnerLogoInput => ({
  name: v.name,
  logoId: v.logo?.id ?? '',
  link: v.link,
  placement: v.placement,
  isActive: v.isActive,
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
    formState: { errors },
  } = useForm<PartnerLogoFormValues>({ defaultValues: empty(), resolver: joiResolver(partnerLogoSchema) })

  useEffect(() => {
    if (!open) return
    reset(item ? toFormValues(item) : empty())
    mutation.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, item])

  const onSubmit = (values: PartnerLogoFormValues) => {
    if (isEdit && item) updateItem.mutate({ id: item.id, ...toPayload(values) }, { onSuccess: onClose })
    else createItem.mutate(toPayload(values), { onSuccess: onClose })
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

        <Controller
          name="logo"
          control={control}
          render={({ field }) => (
            <ImageUpload
              label="Logo"
              required
              value={field.value}
              onChange={field.onChange}
              error={errors.logo?.message as string | undefined}
            />
          )}
        />

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
