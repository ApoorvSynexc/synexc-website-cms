import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { Button, Modal, TextField, Typography } from '../../../components'
import { getErrorMessage } from '../../../lib'
import { useBlogCategory, type BlogCategory } from '../../../services'
import { slugify } from '../../../utils/helper'
import { categorySchema, type CategoryFormValues } from './validations'

type Props = {
  open: boolean
  onClose: () => void
  category?: BlogCategory | null
}

export default function ManageCategoryModal({ open, onClose, category }: Props) {
  const isEdit = Boolean(category)
  const { createCategory, updateCategory } = useBlogCategory()
  const mutation = isEdit ? updateCategory : createCategory

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<CategoryFormValues>({
    defaultValues: { name: '', slug: '' },
    resolver: joiResolver(categorySchema),
  })

  useEffect(() => {
    if (!open) return
    reset({ name: category?.name ?? '', slug: category?.slug ?? '' })
    mutation.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, category])

  const nameField = register('name', {
    onChange: (e) => {
      if (!dirtyFields.slug) setValue('slug', slugify(e.target.value))
    },
  })

  const onSubmit = (values: CategoryFormValues) => {
    const payload = { name: values.name.trim(), slug: values.slug }
    if (isEdit && category) {
      updateCategory.mutate({ id: category.id, ...payload }, { onSuccess: onClose })
    } else {
      createCategory.mutate(payload, { onSuccess: onClose })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Category' : 'Add Category'}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button size="sm" loading={mutation.isPending} onClick={handleSubmit(onSubmit)}>
            {isEdit ? 'Save Changes' : 'Create Category'}
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
          label="Name"
          placeholder="e.g. Cloud"
          required
          error={errors.name?.message}
          {...nameField}
        />
        <TextField
          label="Slug"
          placeholder="cloud"
          required
          error={errors.slug?.message}
          {...register('slug')}
        />
      </form>
    </Modal>
  )
}
