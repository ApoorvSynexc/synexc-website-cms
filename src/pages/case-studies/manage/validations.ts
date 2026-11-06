import Joi from 'joi'
import type { CaseStudyResult, CaseStudyStatus, Media } from '../../../services'

export type CaseStudyFormValues = {
  title: string
  slug: string
  client: string
  category: string
  description: string
  /** The uploaded cover image (its id is what gets saved), or null. */
  image: Media | null
  content: string
  tags: string[]
  results: CaseStudyResult[]
  readTime: string
  publishStatus: CaseStudyStatus
  publishedAt: string
}

export const caseStudySchema = Joi.object<CaseStudyFormValues>({
  title: Joi.string().trim().max(200).required().messages({
    'string.empty': 'Title is required',
    'string.max': 'Title must be at most 200 characters',
  }),
  slug: Joi.string()
    .trim()
    .max(200)
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required()
    .messages({
      'string.empty': 'Slug is required',
      'string.max': 'Slug must be at most 200 characters',
      'string.pattern.base': 'Use lowercase letters, numbers and single hyphens only',
    }),
  client: Joi.string().trim().max(100).required().messages({
    'string.empty': 'Client name is required',
    'string.max': 'Client name must be at most 100 characters',
  }),
  category: Joi.string().required().messages({ 'string.empty': 'Select a category' }),
  description: Joi.string().trim().max(400).required().messages({
    'string.empty': 'Short description is required',
    'string.max': 'Description must be at most 400 characters',
  }),
  image: Joi.object().allow(null).messages({ 'object.base': 'Upload a valid image' }),
  content: Joi.string()
    .required()
    .custom((value: string, helpers) => {
      const text = value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').trim()
      if (text.length < 20 && !/<img\b/i.test(value)) return helpers.error('content.short')
      return value
    })
    .messages({
      'string.empty': 'Content is required',
      'content.short': 'Content must be at least 20 characters',
    }),
  tags: Joi.array().items(Joi.string().max(40)).max(10),
  results: Joi.array()
    .items(
      Joi.object({
        metric: Joi.string().trim().max(12).required().messages({
          'string.empty': 'Add a figure, e.g. 81%',
          'string.max': 'Max 12 characters',
        }),
        label: Joi.string().trim().max(60).required().messages({
          'string.empty': 'Add a label',
          'string.max': 'Max 60 characters',
        }),
      }),
    )
    .max(4),
  readTime: Joi.string()
    .trim()
    .pattern(/^\d{1,2} min read$/)
    .required()
    .messages({
      'string.empty': 'Read time is required',
      'string.pattern.base': 'Use the format "5 min read"',
    }),
  publishStatus: Joi.string().valid('PUBLISHED', 'DRAFT').required(),
  publishedAt: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      'string.empty': 'Publish date is required',
      'string.pattern.base': 'Enter a valid date',
    }),
})
