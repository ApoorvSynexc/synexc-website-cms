import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { Button, Modal, TextField, ToggleButton, Typography, ImageUpload } from '../../../components'
import { getErrorMessage } from '../../../lib'
import { TESTIMONIAL_PAGES, useTestimonial } from '../../../services'
import type { Testimonial, TestimonialInput } from '../../../services'
import type { ManageModalProps } from '../ContentList'
import { testimonialSchema, type TestimonialFormValues } from './validations'

const empty = (): TestimonialFormValues => ({
  name: '',
  role: '',
  message: '',
  avatar: null,
  pages: [],
  isActive: true,
})

const toFormValues = (item: Testimonial): TestimonialFormValues => ({
  name: item.name,
  role: item.role,
  message: item.message,
  avatar: item.avatar,
  pages: item.pages,
  isActive: item.isActive,
})

const toPayload = (v: TestimonialFormValues): TestimonialInput => ({
  name: v.name,
  role: v.role,
  message: v.message,
  avatarId: v.avatar?.id ?? null,
  pages: v.pages,
  isActive: v.isActive,
})

export default function ManageTestimonialModal({ open, onClose, item }: ManageModalProps<Testimonial>) {
  const isEdit = Boolean(item)
  const { createItem, updateItem } = useTestimonial()
  const mutation = isEdit ? updateItem : createItem

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TestimonialFormValues>({ defaultValues: empty(), resolver: joiResolver(testimonialSchema) })

  useEffect(() => {
    if (!open) return
    reset(item ? toFormValues(item) : empty())
    mutation.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, item])

  const messageLength = watch('message')?.length ?? 0

  const onSubmit = (values: TestimonialFormValues) => {
    if (isEdit && item) updateItem.mutate({ id: item.id, ...toPayload(values) }, { onSuccess: onClose })
    else createItem.mutate(toPayload(values), { onSuccess: onClose })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Testimonial' : 'Add Testimonial'}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button size="sm" loading={mutation.isPending} onClick={handleSubmit(onSubmit)}>
            {isEdit ? 'Save Changes' : 'Create Testimonial'}
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

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Name" placeholder="e.g. Mark Thompson" required error={errors.name?.message} {...register('name')} />
          <TextField
            label="Role / company"
            placeholder="e.g. CEO, TechFlow Solutions"
            required
            error={errors.role?.message}
            {...register('role')}
          />
        </div>

        <div>
          <label htmlFor="tm-message" className="mb-1.5 block text-sm font-medium text-heading">
            Testimonial <span className="text-red-500">*</span>
          </label>
          <textarea
            id="tm-message"
            rows={4}
            placeholder="What did the client say?"
            className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-heading outline-none transition-colors placeholder:text-body/60 focus:border-accent"
            {...register('message')}
          />
          <div className="mt-1 flex justify-between text-xs">
            <span className="text-red-500">{errors.message?.message}</span>
            <span className={messageLength > 500 ? 'text-red-500' : 'text-body'}>{messageLength}/500</span>
          </div>
        </div>

        <Controller
          name="avatar"
          control={control}
          render={({ field }) => (
            <ImageUpload
              label="Client logo / photo (optional)"
              value={field.value}
              onChange={field.onChange}
              error={errors.avatar?.message as string | undefined}
            />
          )}
        />

        <Controller
          name="pages"
          control={control}
          render={({ field }) => (
            <fieldset>
              <legend className="mb-1.5 text-sm font-medium text-heading">
                Show on pages <span className="text-red-500">*</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {TESTIMONIAL_PAGES.map((page) => {
                  const checked = field.value.includes(page.value)
                  return (
                    <label
                      key={page.value}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                        checked ? 'border-accent bg-accent-bg text-accent' : 'border-border text-body hover:bg-surface-2'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-[var(--accent)]"
                        checked={checked}
                        onChange={() =>
                          field.onChange(
                            checked ? field.value.filter((v) => v !== page.value) : [...field.value, page.value],
                          )
                        }
                      />
                      {page.label}
                    </label>
                  )
                })}
              </div>
              {errors.pages && <p className="mt-1 text-xs text-red-500">{errors.pages.message}</p>}
            </fieldset>
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
