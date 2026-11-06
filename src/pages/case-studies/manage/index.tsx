import { useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import dayjs from 'dayjs'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import {
  Button,
  Dropdown,
  ImageUpload,
  Modal,
  RichTextEditor,
  TagInput,
  TextField,
  Typography,
} from '../../../components'
import { getErrorMessage } from '../../../lib'
import { CASE_STUDY_CATEGORIES, useCaseStudy, type CaseStudy } from '../../../services'
import { slugify } from '../../../utils/helper'
import { caseStudySchema, type CaseStudyFormValues } from './validations'

type Props = {
  open: boolean
  onClose: () => void
  /** Pass a case study to edit it; omit for create. */
  caseStudy?: CaseStudy | null
}

const STATUS_OPTIONS = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Published', value: 'PUBLISHED' },
]

const CATEGORY_OPTIONS = CASE_STUDY_CATEGORIES.map((c) => ({ label: c, value: c }))

const emptyValues = (): CaseStudyFormValues => ({
  title: '',
  slug: '',
  client: '',
  category: '',
  description: '',
  image: null,
  content: '',
  tags: [],
  results: [],
  readTime: '5 min read',
  publishStatus: 'DRAFT',
  publishedAt: dayjs().format('YYYY-MM-DD'),
})

/** Only the fields the form edits (the API row also has id, imageId, createdAt …). */
const toFormValues = (study: CaseStudy): CaseStudyFormValues => ({
  title: study.title,
  slug: study.slug,
  client: study.client,
  category: study.category,
  description: study.description,
  image: study.image,
  content: study.content,
  tags: study.tags,
  results: study.results,
  readTime: study.readTime,
  publishStatus: study.publishStatus,
  publishedAt: study.publishedAt,
})

const textareaClass =
  'w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-heading outline-none transition-colors placeholder:text-body/60 focus:border-accent'

export default function ManageCaseStudyModal({ open, onClose, caseStudy }: Props) {
  const isEdit = Boolean(caseStudy)
  const { createCaseStudy, updateCaseStudy } = useCaseStudy()
  const mutation = isEdit ? updateCaseStudy : createCaseStudy

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<CaseStudyFormValues>({
    defaultValues: emptyValues(),
    resolver: joiResolver(caseStudySchema),
  })
  const results = useFieldArray({ control, name: 'results' })

  useEffect(() => {
    if (!open) return
    reset(caseStudy ? toFormValues(caseStudy) : emptyValues())
    mutation.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, caseStudy])

  const descriptionLength = watch('description')?.length ?? 0

  const titleField = register('title', {
    onChange: (e) => {
      if (!dirtyFields.slug) setValue('slug', slugify(e.target.value))
    },
  })

  const onSubmit = ({ image, ...values }: CaseStudyFormValues) => {
    // Files are saved by id: the picker already uploaded the image, so only its id goes with the study.
    const payload = {
      ...values,
      title: values.title.trim(),
      client: values.client.trim(),
      imageId: image?.id ?? null,
    }
    if (isEdit && caseStudy) {
      updateCaseStudy.mutate({ id: caseStudy.id, ...payload }, { onSuccess: onClose })
    } else {
      createCaseStudy.mutate(payload, { onSuccess: onClose })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title={isEdit ? 'Edit Case Study' : 'Add Case Study'}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button size="sm" loading={mutation.isPending} onClick={handleSubmit(onSubmit)}>
            {isEdit ? 'Save Changes' : 'Create Case Study'}
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
          placeholder="e.g. Automating Stripe–Zoho Books Integration for a SaaS Company"
          required
          error={errors.title?.message}
          {...titleField}
        />
        <TextField
          label="Slug"
          required
          helperText="Used in the URL: /case-studies/your-slug"
          error={errors.slug?.message}
          {...register('slug')}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Client" placeholder="e.g. Veriport" required error={errors.client?.message} {...register('client')} />
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Category"
                placeholder="Select category"
                required
                options={CATEGORY_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                error={errors.category?.message}
              />
            )}
          />
        </div>

        <div>
          <label htmlFor="cs-description" className="mb-1.5 block text-sm font-medium text-heading">
            Short description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="cs-description"
            rows={2}
            placeholder="Summary shown on the case study card."
            className={textareaClass}
            {...register('description')}
          />
          <div className="mt-1 flex justify-between text-xs">
            <span className="text-red-500">{errors.description?.message}</span>
            <span className={descriptionLength > 400 ? 'text-red-500' : 'text-body'}>{descriptionLength}/400</span>
          </div>
        </div>

        <Controller
          name="image"
          control={control}
          render={({ field }) => (
            <ImageUpload
              label="Cover image"
              value={field.value}
              onChange={field.onChange}
              helperText="Shown on the case study card and at the top of the page."
              error={errors.image?.message}
            />
          )}
        />

        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <TagInput
              label="Technologies / tags"
              value={field.value}
              onChange={field.onChange}
              placeholder="e.g. Zoho CRM — press Enter to add"
              helperText="Up to 10 tags."
              error={errors.tags?.message}
            />
          )}
        />

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium text-heading">Key results</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<FiPlus size={14} />}
              disabled={results.fields.length >= 4}
              onClick={() => results.append({ metric: '', label: '' })}
            >
              Add result
            </Button>
          </div>
          {results.fields.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border px-3 py-3 text-xs text-body">
              Highlight up to 4 headline numbers, e.g. “81%” — “Lead Capture Increase”.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {results.fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="w-28 shrink-0">
                    <TextField
                      size="sm"
                      placeholder="81%"
                      aria-label={`Result ${index + 1} figure`}
                      error={errors.results?.[index]?.metric?.message}
                      {...register(`results.${index}.metric`)}
                    />
                  </div>
                  <div className="flex-1">
                    <TextField
                      size="sm"
                      placeholder="Lead Capture Increase"
                      aria-label={`Result ${index + 1} label`}
                      error={errors.results?.[index]?.label?.message}
                      {...register(`results.${index}.label`)}
                    />
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove result ${index + 1}`}
                    onClick={() => results.remove(index)}
                    className="mt-1 rounded-lg p-1.5 text-body transition-colors hover:bg-surface-2 hover:text-red-500"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="cs-content" className="mb-1.5 block text-sm font-medium text-heading">
            Content <span className="text-red-500">*</span>
          </label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                id="cs-content"
                value={field.value}
                onChange={field.onChange}
                placeholder="Overview, challenge, solution, results…"
                error={Boolean(errors.content)}
              />
            )}
          />
          {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            label="Read time"
            placeholder="5 min read"
            required
            error={errors.readTime?.message}
            {...register('readTime')}
          />
          <Controller
            name="publishStatus"
            control={control}
            render={({ field }) => (
              <Dropdown label="Status" required options={STATUS_OPTIONS} value={field.value} onChange={field.onChange} />
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
