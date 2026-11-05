import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { Button, Dropdown, Modal, TextField, ToggleButton, Typography } from '../../../components'
import { getErrorMessage } from '../../../lib'
import { GALLERY_ALBUMS, useGallery, type GalleryImage } from '../../../services'
import type { ManageModalProps } from '../ContentList'
import { ImagePreview } from '../shared'
import { gallerySchema, type GalleryFormValues } from './validations'

const ALBUM_OPTIONS = GALLERY_ALBUMS.map((a) => ({ label: a, value: a }))

const empty = (): GalleryFormValues => ({ image: '', caption: '', album: '', isActive: true })

export default function ManageGalleryModal({ open, onClose, item }: ManageModalProps<GalleryImage>) {
  const isEdit = Boolean(item)
  const { createItem, updateItem } = useGallery()
  const mutation = isEdit ? updateItem : createItem

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<GalleryFormValues>({ defaultValues: empty(), resolver: joiResolver(gallerySchema) })

  useEffect(() => {
    if (!open) return
    reset(item ? { ...item } : empty())
    mutation.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, item])

  const image = watch('image')

  const onSubmit = (values: GalleryFormValues) => {
    if (isEdit && item) updateItem.mutate({ id: item.id, ...values }, { onSuccess: onClose })
    else createItem.mutate(values, { onSuccess: onClose })
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

        <div>
          <TextField
            label="Photo"
            placeholder="https://… or /about1.png"
            required
            helperText="Photo upload arrives with the API; for now paste a URL or site path."
            error={errors.image?.message}
            {...register('image')}
          />
          {!errors.image && <ImagePreview src={image} />}
        </div>

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
