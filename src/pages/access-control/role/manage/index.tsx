import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { Button, Modal, TextField, Typography } from '../../../../components'
import { getErrorMessage } from '../../../../lib'
import { useRole, type Role } from '../../../../services'
import { roleSchema, type RoleFormValues } from './validations'

type Props = {
  open: boolean
  onClose: () => void
  role?: Role | null
}

export default function ManageRoleModal({ open, onClose, role }: Props) {
  const isEdit = Boolean(role)
  const { createRole, updateRole } = useRole()
  const mutation = isEdit ? updateRole : createRole

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RoleFormValues>({
    defaultValues: { name: '', description: '' },
    resolver: joiResolver(roleSchema),
  })

  useEffect(() => {
    if (!open) return
    reset({ name: role?.name ?? '', description: role?.description ?? '' })
    mutation.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, role])

  const descriptionLength = watch('description')?.length ?? 0

  const onSubmit = (values: RoleFormValues) => {
    const payload = { name: values.name.trim(), description: values.description.trim() }
    if (isEdit && role) updateRole.mutate({ id: role.id, ...payload }, { onSuccess: onClose })
    else createRole.mutate(payload, { onSuccess: onClose })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Role' : 'Add Role'}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button size="sm" loading={mutation.isPending} onClick={handleSubmit(onSubmit)}>
            {isEdit ? 'Save Changes' : 'Create Role'}
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
        <TextField label="Name" placeholder="e.g. Reviewer" required error={errors.name?.message} {...register('name')} />
        <div>
          <label htmlFor="role-description" className="mb-1.5 block text-sm font-medium text-heading">
            Description
          </label>
          <textarea
            id="role-description"
            rows={3}
            placeholder="What can this role do?"
            className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-heading outline-none transition-colors placeholder:text-body/60 focus:border-accent"
            {...register('description')}
          />
          <div className="mt-1 flex justify-between text-xs">
            <span className="text-red-500">{errors.description?.message}</span>
            <span className={descriptionLength > 300 ? 'text-red-500' : 'text-body'}>{descriptionLength}/300</span>
          </div>
        </div>
        <Typography variant="caption" color="body">
          Set what this role can access under <strong>Role Permissions</strong> after creating it.
        </Typography>
      </form>
    </Modal>
  )
}
