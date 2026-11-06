import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { Button, Dropdown, Modal, TextField, ToggleButton, Typography, ImageUpload } from '../../../components'
import { getErrorMessage } from '../../../lib'
import { GALLERY_ALBUMS, useGallery, type GalleryImage, type GalleryImageInput } from '../../../services'
import type { ManageModalProps } from '../ContentList'
import { gallerySchema, type GalleryFormValues } from './validations'

const ALBUM_OPTIONS = GALLERY_ALBUMS.map((a) => ({ label: a, value: a }))

const empty = (): GalleryFormValues => ({ image: null, caption: '', album: '', isActive: true })

const toFormValues = (item: GalleryImage): GalleryFormValues => ({
  image: item.image,
  caption: item.caption,
  album: item.album,
  isActive: item.isActive,
})

const toPayload = (v: GalleryFormValues): GalleryImageInput => ({
  imageId: v.image?.id ?? '',
  caption: v.caption,
  album: v.album,
  isActive: v.isActive,
})

export default function ManageGalleryModal({ open, onClose, item }: ManageModalProps<GalleryImage>) {
  const isEdit = Boolean(item)
  const { createItem, updateItem } = useGallery()
  const mutation = isEdit ? updateItem : createItem

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GalleryFormValues>({ defaultValues: empty(), resolver: joiResolver(gallerySchema) })

  useEffect(() => {
    if (!open) return
    reset(item ? toFormValues(item) : empty())
    mutation.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, item])

  const onSubmit = (values: GalleryFormValues) => {
    if (isEdit && item) updateItem.mutate({ id: item.id, ...toPayload(values) }, { onSuccess: onClose })
    else createItem.mutate(toPayload(values), { onSuccess: onClose })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Photo' : 'Add Photo'}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button size="sm" loading={mutation.isPending} onClick={handleSubmit(onSubmit)}>
            {isEdit ? 'Save Changes' : 'Add Photo'}
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
          name="image"
          control={control}
          render={({ field }) => (
            <ImageUpload
              label="Photo"
              required
              value={field.value}
              onChange={field.onChange}
              error={errors.image?.message as string | undefined}
            />
          )}
        />

        <Controller
          name="album"
          control={control}
          render={({ field }) => (
            <Dropdown
              label="Album"
              placeholder="Select album"
              required
              options={ALBUM_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.album?.message}
            />
          )}
        />

        <TextField
          label="Caption (optional)"
          placeholder="e.g. Team offsite 2026"
          error={errors.caption?.message}
          {...register('caption')}
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
