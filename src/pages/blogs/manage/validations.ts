import Joi from 'joi'
import type { BlogStatus, Media } from '../../../services'

export type BlogFormValues = {
  title: string
  slug: string
  excerpt: string
  content: string
  categoryId: string
  author: string
  /** The uploaded cover image (its id is what gets saved), or null. */
  featuredImage: Media | null
  publishStatus: BlogStatus
  publishedAt: string
}

export const blogSchema = Joi.object<BlogFormValues>({
  title: Joi.string().trim().max(150).required().messages({
    'string.empty': 'Title is required',
    'string.max': 'Title must be at most 150 characters',
  }),
  slug: Joi.string()
    .trim()
    .max(160)
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required()
    .messages({
      'string.empty': 'Slug is required',
      'string.max': 'Slug must be at most 160 characters',
      'string.pattern.base': 'Use lowercase letters, numbers and single hyphens only',
    }),
  excerpt: Joi.string().trim().max(300).required().messages({
    'string.empty': 'Excerpt is required',
    'string.max': 'Excerpt must be at most 300 characters',
  }),
  // Editor output is HTML — validate the visible text, not the markup. An
  // image-only article is allowed.
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
  categoryId: Joi.string().required().messages({
    'string.empty': 'Select a category',
  }),
  author: Joi.string().trim().max(80).required().messages({
    'string.empty': 'Author is required',
    'string.max': 'Author must be at most 80 characters',
  }),
  featuredImage: Joi.object().allow(null).messages({ 'object.base': 'Upload a valid image' }),
  publishStatus: Joi.string().valid('PUBLISHED', 'DRAFT').required(),
  publishedAt: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      'string.empty': 'Publish date is required',
      'string.pattern.base': 'Enter a valid date',
    }),
})
