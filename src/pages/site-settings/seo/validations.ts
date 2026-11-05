import Joi from 'joi'
import { assetUrl } from '../../website-content/shared'

export type SeoFormValues = {
  path: string
  pageName: string
  title: string
  description: string
  ogImage: string
  noIndex: boolean
}

export const seoSchema = Joi.object<SeoFormValues>({
  path: Joi.string()
    .trim()
    .max(120)
    .pattern(/^\/[a-z0-9\-/]*$/)
    .required()
    .messages({
      'string.empty': 'Page path is required',
      'string.max': 'Path must be at most 120 characters',
      'string.pattern.base': 'Start with / and use lowercase letters, numbers and hyphens, e.g. /about-us',
    }),
  pageName: Joi.string().trim().max(60).required().messages({
    'string.empty': 'Page name is required',
    'string.max': 'Page name must be at most 60 characters',
  }),
  title: Joi.string().trim().max(60).allow('').messages({
    'string.max': 'Keep the title under 60 characters so it is not cut off in search results',
  }),
  description: Joi.string().trim().max(160).allow('').messages({
    'string.max': 'Keep the description under 160 characters so it is not cut off in search results',
  }),
  ogImage: assetUrl,
  noIndex: Joi.boolean(),
})
