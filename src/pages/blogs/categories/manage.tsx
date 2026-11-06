import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { Button, Modal, TextField, Typography } from '../../../components'
import { getErrorMessage } from '../../../lib'
import { useBlogCategory, type BlogCategory } from '../../../services'
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
    formState: { errors },
  } = useForm<CategoryFormValues>({
    defaultValues: { name: '' },
    resolver: joiResolver(categorySchema),
  })

  useEffect(() => {
    if (!open) return
    reset({ name: category?.name ?? '' })
    mutation.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, category])

  const onSubmit = (values: CategoryFormValues) => {
    const payload = { name: values.name.trim() }
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
          {...register('name')}
        />
      </form>
    </Modal>
  )
}
