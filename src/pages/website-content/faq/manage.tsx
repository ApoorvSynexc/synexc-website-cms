import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { Button, Dropdown, Modal, TextField, ToggleButton, Typography } from '../../../components'
import { getErrorMessage } from '../../../lib'
import { FAQ_GROUPS, useFaq, type Faq } from '../../../services'
import type { ManageModalProps } from '../ContentList'
import { faqSchema, type FaqFormValues } from './validations'

const GROUP_OPTIONS = FAQ_GROUPS.map((g) => ({ label: g, value: g }))

const empty = (): FaqFormValues => ({ question: '', answer: '', group: '', isActive: true })

export default function ManageFaqModal({ open, onClose, item }: ManageModalProps<Faq>) {
  const isEdit = Boolean(item)
  const { createItem, updateItem } = useFaq()
  const mutation = isEdit ? updateItem : createItem

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FaqFormValues>({ defaultValues: empty(), resolver: joiResolver(faqSchema) })

  useEffect(() => {
    if (!open) return
    reset(item ? { ...item } : empty())
    mutation.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, item])

  const answerLength = watch('answer')?.length ?? 0

  const onSubmit = (values: FaqFormValues) => {
    if (isEdit && item) updateItem.mutate({ id: item.id, ...values }, { onSuccess: onClose })
    else createItem.mutate(values, { onSuccess: onClose })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit FAQ' : 'Add FAQ'}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button size="sm" loading={mutation.isPending} onClick={handleSubmit(onSubmit)}>
            {isEdit ? 'Save Changes' : 'Create FAQ'}
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
          name="group"
          control={control}
          render={({ field }) => (
            <Dropdown
              label="Shown on"
              placeholder="Select page / section"
              required
              options={GROUP_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.group?.message}
            />
          )}
        />
        <TextField
          label="Question"
          placeholder="e.g. Which industries does Synexc specialize in?"
          required
          error={errors.question?.message}
          {...register('question')}
        />

        <div>
          <label htmlFor="faq-answer" className="mb-1.5 block text-sm font-medium text-heading">
            Answer <span className="text-red-500">*</span>
          </label>
          <textarea
            id="faq-answer"
            rows={5}
            className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-heading outline-none transition-colors placeholder:text-body/60 focus:border-accent"
            {...register('answer')}
          />
          <div className="mt-1 flex justify-between text-xs">
            <span className="text-red-500">{errors.answer?.message}</span>
            <span className={answerLength > 1200 ? 'text-red-500' : 'text-body'}>{answerLength}/1200</span>
          </div>
        </div>

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
