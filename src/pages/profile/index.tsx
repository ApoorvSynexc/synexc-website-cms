import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { FiLock } from 'react-icons/fi'
import { Avatar, Button, ImageUpload, Panel, TextField, Typography } from '../../components'
import { useSession } from '../../hooks'
import { getErrorMessage } from '../../lib'
import { useAccount } from '../../services'
import {
  passwordSchema,
  profileSchema,
  type PasswordFormValues,
  type ProfileFormValues,
} from './validations'

export default function ProfilePage() {
  const { user } = useSession()
  const { updateProfile, changePassword } = useAccount()
  const [saved, setSaved] = useState<'profile' | 'password' | null>(null)

  const profileForm = useForm<ProfileFormValues>({
    defaultValues: { name: '', avatar: null },
    resolver: joiResolver(profileSchema),
  })
  const passwordForm = useForm<PasswordFormValues>({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    resolver: joiResolver(passwordSchema),
  })

  // Fill the form once the profile has loaded (and again after a save refreshes it).
  useEffect(() => {
    if (user) profileForm.reset({ name: user.name, avatar: user.avatar })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const onSaveProfile = (v: ProfileFormValues) => {
    setSaved(null)
    updateProfile.mutate(
      { name: v.name, avatarId: v.avatar?.id ?? null },
      { onSuccess: () => setSaved('profile') },
    )
  }

  const onChangePassword = ({ currentPassword, newPassword }: PasswordFormValues) => {
    setSaved(null)
    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          passwordForm.reset()
          setSaved('password')
        },
      },
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      <div>
        <Typography variant="h5">My Profile</Typography>
        <Typography variant="body-sm" color="body" className="mt-0.5">
          Your name, photo and password.
        </Typography>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface p-5">
        <Avatar name={user?.name} src={user?.avatar?.thumbnailUrl ?? user?.avatar?.url} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-heading">{user?.name}</p>
          <p className="truncate text-sm text-body">{user?.email}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-bg px-3 py-1 text-xs font-medium text-accent">
          <FiLock size={12} />
          {user?.role?.name}
        </span>
        <p className="w-full text-xs text-body">
          Your email and role are set by an administrator and can&apos;t be changed here. You can edit your photo,
          name and password below.
        </p>
      </div>

      <Panel title="Edit profile" subtitle="Shown in the top bar and to other admins">
        <form onSubmit={profileForm.handleSubmit(onSaveProfile)} noValidate className="flex flex-col gap-4">
          {updateProfile.isError && (
            <Typography variant="body-sm" className="text-red-500">
              {getErrorMessage(updateProfile.error)}
            </Typography>
          )}
          {saved === 'profile' && (
            <Typography variant="body-sm" className="text-emerald-600">
              Profile updated.
            </Typography>
          )}

          <Controller
            name="avatar"
            control={profileForm.control}
            render={({ field }) => (
              <ImageUpload
                label="Photo (optional)"
                helperText="Without a photo your initials are shown."
                value={field.value}
                onChange={field.onChange}
                error={profileForm.formState.errors.avatar?.message as string | undefined}
              />
            )}
          />

          <TextField
            label="Name"
            required
            error={profileForm.formState.errors.name?.message}
            {...profileForm.register('name')}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              loading={updateProfile.isPending}
              disabled={!profileForm.formState.isDirty}
            >
              Save changes
            </Button>
          </div>
        </form>
      </Panel>

      <Panel title="Change password" subtitle="You stay signed in here; other devices are signed out">
        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} noValidate className="flex flex-col gap-4">
          {changePassword.isError && (
            <Typography variant="body-sm" className="text-red-500">
              {getErrorMessage(changePassword.error)}
            </Typography>
          )}
          {saved === 'password' && (
            <Typography variant="body-sm" className="text-emerald-600">
              Password changed.
            </Typography>
          )}

          <TextField
            label="Current password"
            type="password"
            autoComplete="current-password"
            required
            error={passwordForm.formState.errors.currentPassword?.message}
            {...passwordForm.register('currentPassword')}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="New password"
              type="password"
              autoComplete="new-password"
              required
              helperText="8+ characters with a letter and a number."
              error={passwordForm.formState.errors.newPassword?.message}
              {...passwordForm.register('newPassword')}
            />
            <TextField
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              required
              error={passwordForm.formState.errors.confirmPassword?.message}
              {...passwordForm.register('confirmPassword')}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" size="sm" loading={changePassword.isPending}>
              Change password
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  )
}
