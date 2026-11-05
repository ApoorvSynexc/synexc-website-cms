import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { Button, Modal, TextField, ToggleButton, Typography } from '../../../components'
import { getErrorMessage } from '../../../lib'
import { useSeoPage, type SeoPage } from '../../../services'
import type { ManageModalProps } from '../../website-content/ContentList'
import { ImagePreview } from '../../website-content/shared'
import { seoSchema, type SeoFormValues } from './validations'

const empty = (): SeoFormValues => ({
  path: '',
  pageName: '',
  title: '',
  description: '',
  ogImage: '',
  noIndex: false,
})

const SITE_HOST = 'synexc.com'

export default function ManageSeoModal({ open, onClose, item }: ManageModalProps<SeoPage>) {
  const isEdit = Boolean(item)
  const { getItems, createItem, updateItem } = useSeoPage()
  const mutation = isEdit ? updateItem : createItem

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors },
  } = useForm<SeoFormValues>({ defaultValues: empty(), resolver: joiResolver(seoSchema) })

  useEffect(() => {
    if (!open) return
    reset(item ? { ...item } : empty())
    mutation.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, item])

  const [path, pageName, title, description, ogImage] = watch(['path', 'pageName', 'title', 'description', 'ogImage'])

  const onSubmit = (values: SeoFormValues) => {
    const clash = (getItems.data ?? []).some((p) => p.path === values.path && p.id !== item?.id)
    if (clash) {
      setError('path', { message: 'Another entry already uses this path' })
      return
    }
    const payload = { ...values, isActive: true }
    if (isEdit && item) updateItem.mutate({ id: item.id, ...payload }, { onSuccess: onClose })
    else createItem.mutate(payload, { onSuccess: onClose })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={isEdit ? 'Edit Page SEO' : 'Add Page SEO'}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button size="sm" loading={mutation.isPending} onClick={handleSubmit(onSubmit)}>
            {isEdit ? 'Save Changes' : 'Add Page'}
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
          <TextField
            label="Page path"
            placeholder="/about-us"
            required
            error={errors.path?.message}
            {...register('path')}
          />
          <TextField
            label="Page name"
            placeholder="About us"
            helperText="For your reference in the CMS only."
            required
            error={errors.pageName?.message}
            {...register('pageName')}
          />
        </div>

        <div>
          <TextField
            label="SEO title"
            placeholder="e.g. About Synexc | CRM, Cloud & AI Consulting"
            error={errors.title?.message}
            {...register('title')}
          />
          <Counter value={title?.length ?? 0} max={60} />
        </div>

        <div>
          <label htmlFor="seo-desc" className="mb-1.5 block text-sm font-medium text-heading">
            Meta description
          </label>
          <textarea
            id="seo-desc"
            rows={3}
            placeholder="A short summary that appears under the title in search results."
            className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-heading outline-none transition-colors placeholder:text-body/60 focus:border-accent"
            {...register('description')}
          />
          <div className="flex justify-between">
            <span className="mt-1 text-xs text-red-500">{errors.description?.message}</span>
            <Counter value={description?.length ?? 0} max={160} />
          </div>
        </div>

        <div>
          <TextField
            label="Share image (optional)"
            placeholder="https://… or /og/home.png"
            helperText="Shown when the page is shared on LinkedIn, WhatsApp, etc. 1200×630 works best."
            error={errors.ogImage?.message}
            {...register('ogImage')}
          />
          {!errors.ogImage && <ImagePreview src={ogImage} />}
        </div>

        <Controller
          name="noIndex"
          control={control}
          render={({ field }) => (
            <label className="flex items-center gap-3 text-sm text-heading">
              <ToggleButton size="sm" checked={field.value} onChange={field.onChange} label="Hide from search engines" />
              Hide this page from search engines (noindex)
            </label>
          )}
        />

        <div className="rounded-lg border border-border bg-surface-2 p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-body">Search result preview</p>
          <p className="truncate text-xs text-body">
            {SITE_HOST}
            {path || '/'}
          </p>
          <p className="truncate text-base font-medium text-[#1a0dab] dark:text-sky-400">
            {title || pageName || 'Page title'}
          </p>
          <p className="line-clamp-2 text-sm text-body">
            {description || 'No description set — search engines will pick text from the page.'}
          </p>
        </div>
      </form>
    </Modal>
  )
}

function Counter({ value, max }: { value: number; max: number }) {
  return (
    <p className={`mt-1 text-right text-xs ${value > max ? 'text-red-500' : 'text-body'}`}>
      {value}/{max}
    </p>
  )
}
