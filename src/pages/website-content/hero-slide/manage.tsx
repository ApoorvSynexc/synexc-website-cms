import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { Button, Modal, TextField, ToggleButton, Typography } from '../../../components'
import { getErrorMessage } from '../../../lib'
import { useHeroSlide, type HeroSlide } from '../../../services'
import type { ManageModalProps } from '../ContentList'
import { ImagePreview } from '../shared'
import { heroSlideSchema, type HeroSlideFormValues } from './validations'

const empty = (): HeroSlideFormValues => ({
  category: '',
  title: '',
  description: '',
  image: '',
  logo: '',
  link: '',
  isActive: true,
})

export default function ManageHeroSlideModal({ open, onClose, item }: ManageModalProps<HeroSlide>) {
  const isEdit = Boolean(item)
  const { createItem, updateItem } = useHeroSlide()
  const mutation = isEdit ? updateItem : createItem

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<HeroSlideFormValues>({ defaultValues: empty(), resolver: joiResolver(heroSlideSchema) })

  useEffect(() => {
    if (!open) return
    reset(item ? { ...item } : empty())
    mutation.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, item])

  const image = watch('image')
  const logo = watch('logo')
  const descLength = watch('description')?.length ?? 0

  const onSubmit = (values: HeroSlideFormValues) => {
    if (isEdit && item) updateItem.mutate({ id: item.id, ...values }, { onSuccess: onClose })
    else createItem.mutate(values, { onSuccess: onClose })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Hero Slide' : 'Add Hero Slide'}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button size="sm" loading={mutation.isPending} onClick={handleSubmit(onSubmit)}>
            {isEdit ? 'Save Changes' : 'Create Slide'}
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
          label="Category label"
          placeholder="e.g. CRM Consulting Services"
          required
          error={errors.category?.message}
          {...register('category')}
        />
        <TextField label="Headline" required error={errors.title?.message} {...register('title')} />

        <div>
          <label htmlFor="hs-desc" className="mb-1.5 block text-sm font-medium text-heading">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="hs-desc"
            rows={2}
            className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-heading outline-none transition-colors placeholder:text-body/60 focus:border-accent"
            {...register('description')}
          />
          <div className="mt-1 flex justify-between text-xs">
            <span className="text-red-500">{errors.description?.message}</span>
            <span className={descLength > 200 ? 'text-red-500' : 'text-body'}>{descLength}/200</span>
          </div>
        </div>

        <div>
          <TextField
            label="Banner image"
            placeholder="https://… or /banners/banner-crm.jpg"
            required
            error={errors.image?.message}
            {...register('image')}
          />
          {!errors.image && <ImagePreview src={image} />}
        </div>

        <div>
          <TextField
            label="Partner logo (optional)"
            placeholder="https://… or /client-logo/logo.png"
            error={errors.logo?.message}
            {...register('logo')}
          />
          {!errors.logo && <ImagePreview src={logo} />}
        </div>

        <TextField
          label="Link (optional)"
          placeholder="/services/salesforce or https://…"
          helperText="Where the slide goes when clicked."
          error={errors.link?.message}
          {...register('link')}
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
