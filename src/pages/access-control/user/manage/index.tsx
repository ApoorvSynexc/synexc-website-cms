import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { Button, Dropdown, Modal, TextField, Typography } from '../../../../components'
import { getErrorMessage } from '../../../../lib'
import { useRole, useUser, type User } from '../../../../services'
import { createUserSchema, updateUserSchema, type UserFormValues } from './validations'

type Props = {
  open: boolean
  onClose: () => void
  /** Pass a user to edit; omit for create. */
  user?: User | null
}

const STATUS_OPTIONS = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
]

const emptyValues = (): UserFormValues => ({
  name: '',
  email: '',
  password: '',
  roleId: '',
  status: 'ACTIVE',
})

export default function ManageUserModal({ open, onClose, user }: Props) {
  const isEdit = Boolean(user)
  const [showPassword, setShowPassword] = useState(false)
  const { createUser, updateUser } = useUser()
  const { getRoles } = useRole()
  const mutation = isEdit ? updateUser : createUser

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    defaultValues: emptyValues(),
    resolver: joiResolver(isEdit ? updateUserSchema : createUserSchema),
  })

  useEffect(() => {
    if (!open) return
    reset(user ? { ...emptyValues(), ...user } : emptyValues())
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowPassword(false)
    mutation.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user])

  const roleOptions = (getRoles.data ?? []).map((r) => ({ label: r.name, value: r.id }))

  const onSubmit = ({ password, ...values }: UserFormValues) => {
    const payload = { ...values, name: values.name.trim(), email: values.email.trim() }
    if (isEdit && user) {
      updateUser.mutate({ id: user.id, ...payload, ...(password ? { password } : {}) }, { onSuccess: onClose })
    } else {
      createUser.mutate({ ...payload, password }, { onSuccess: onClose })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit User' : 'Add User'}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button size="sm" loading={mutation.isPending} onClick={handleSubmit(onSubmit)}>
            {isEdit ? 'Save Changes' : 'Create User'}
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

        <TextField label="Full name" placeholder="e.g. Sarah Chen" required error={errors.name?.message} {...register('name')} />
        <TextField
          label="Email"
          type="email"
          autoComplete="off"
          placeholder="name@synexc.com"
          required
          error={errors.email?.message}
          {...register('email')}
        />
        <TextField
          label={isEdit ? 'New password' : 'Password'}
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder={isEdit ? 'Leave blank to keep current password' : 'Min 8 characters, letters and numbers'}
          required={!isEdit}
          error={errors.password?.message}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="pointer-events-auto text-body hover:text-heading"
            >
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          }
          {...register('password')}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="roleId"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Role"
                placeholder="Select role"
                required
                options={roleOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.roleId?.message}
              />
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Dropdown label="Status" required options={STATUS_OPTIONS} value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      </form>
    </Modal>
  )
}
