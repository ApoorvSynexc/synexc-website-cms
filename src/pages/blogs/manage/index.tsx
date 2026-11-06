import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import dayjs from 'dayjs'
import { Button, Dropdown, ImageUpload, Modal, RichTextEditor, TextField, Typography } from '../../../components'
import { getErrorMessage } from '../../../lib'
import { useBlog, useBlogCategory, type Blog } from '../../../services'
import { slugify } from '../../../utils/helper'
import { blogSchema, type BlogFormValues } from './validations'

type ManageBlogModalProps = {
  open: boolean
  onClose: () => void
  /** Pass a blog to edit it; omit for create. */
  blog?: Blog | null
}

const STATUS_OPTIONS = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Published', value: 'PUBLISHED' },
]

const emptyValues = (): BlogFormValues => ({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  categoryId: '',
  author: '',
  featuredImage: null,
  publishStatus: 'DRAFT',
  publishedAt: dayjs().format('YYYY-MM-DD'),
})

/** Only the fields the form edits (the API row also has id, category, createdAt …). */
const toFormValues = (blog: Blog): BlogFormValues => ({
  title: blog.title,
  slug: blog.slug,
  excerpt: blog.excerpt,
  content: blog.content,
  categoryId: blog.categoryId,
  author: blog.author,
  featuredImage: blog.featuredImage,
  publishStatus: blog.publishStatus,
  publishedAt: blog.publishedAt,
})

const textareaClass =
  'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-heading outline-none transition-colors placeholder:text-body/60 focus:border-accent'

export default function ManageBlogModal({ open, onClose, blog }: ManageBlogModalProps) {
  const isEdit = Boolean(blog)
  const { createBlog, updateBlog } = useBlog()
  const { getCategories } = useBlogCategory()
  const mutation = isEdit ? updateBlog : createBlog

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<BlogFormValues>({
    defaultValues: emptyValues(),
    resolver: joiResolver(blogSchema),
  })

  useEffect(() => {
    if (!open) return
    reset(blog ? toFormValues(blog) : emptyValues())
    mutation.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, blog])

  const excerptLength = watch('excerpt')?.length ?? 0

  const categoryOptions = (getCategories.data ?? []).map((c) => ({ label: c.name, value: c.id }))

  const titleField = register('title', {
    // Keep the slug in sync with the title until the user edits the slug by hand.
    onChange: (e) => {
      if (!dirtyFields.slug) setValue('slug', slugify(e.target.value))
    },
  })

  const onSubmit = ({ featuredImage, ...values }: BlogFormValues) => {
    // Files are saved by id: the picker already uploaded the image, so only its id goes with the blog.
    const payload = { ...values, title: values.title.trim(), featuredImageId: featuredImage?.id ?? null }
    if (isEdit && blog) {
      updateBlog.mutate({ id: blog.id, ...payload }, { onSuccess: onClose })
    } else {
      createBlog.mutate(payload, { onSuccess: onClose })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title={isEdit ? 'Edit Blog' : 'Add Blog'}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button size="sm" loading={mutation.isPending} onClick={handleSubmit(onSubmit)}>
            {isEdit ? 'Save Changes' : 'Create Blog'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        {mutation.isError && (
          <div className="sticky -top-4 z-20 -mx-5 -mb-1 bg-surface px-5 pb-3 pt-4 shadow-md">
            <Typography variant="body-sm" className="text-red-500">
              {getErrorMessage(mutation.error)}
            </Typography>
          </div>
        )}

        <TextField
          label="Title"
          placeholder="e.g. How AI Is Changing Gaming"
          required
          error={errors.title?.message}
          {...titleField}
        />

        <TextField
          label="Slug"
          placeholder="how-ai-is-changing-gaming"
          required
          helperText="Used in the blog URL: /blog/your-slug"
          error={errors.slug?.message}
          {...register('slug')}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Category"
                placeholder="Select category"
                required
                fullWidth
                options={categoryOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.categoryId?.message}
              />
            )}
          />
          <TextField
            label="Author"
            placeholder="e.g. Sarah Chen"
            required
            error={errors.author?.message}
            {...register('author')}
          />
        </div>

        <div>
          <label htmlFor="blog-excerpt" className="mb-1.5 block text-sm font-medium text-heading">
            Excerpt <span className="text-red-500">*</span>
          </label>
          <textarea
            id="blog-excerpt"
            rows={2}
            placeholder="Short summary shown on the blog listing."
            className={`${textareaClass} resize-none`}
            {...register('excerpt')}
          />
          <div className="mt-1 flex justify-between text-xs">
            <span className="text-red-500">{errors.excerpt?.message}</span>
            <span className={excerptLength > 300 ? 'text-red-500' : 'text-body'}>
              {excerptLength}/300
            </span>
          </div>
        </div>

        <Controller
          name="featuredImage"
          control={control}
          render={({ field }) => (
            <ImageUpload
              label="Featured image"
              value={field.value}
              onChange={field.onChange}
              helperText="Shown on the blog card and at the top of the article."
              error={errors.featuredImage?.message}
            />
          )}
        />

        <div>
          <label htmlFor="blog-content" className="mb-1.5 block text-sm font-medium text-heading">
            Content <span className="text-red-500">*</span>
          </label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                id="blog-content"
                value={field.value}
                onChange={field.onChange}
                placeholder="Start writing your article…"
                error={Boolean(errors.content)}
              />
            )}
          />
          {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="publishStatus"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Status"
                required
                fullWidth
                options={STATUS_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                error={errors.publishStatus?.message}
              />
            )}
          />
          <TextField
            label="Publish date"
            type="date"
            required
            error={errors.publishedAt?.message}
            {...register('publishedAt')}
          />
        </div>
      </form>
    </Modal>
  )
}
