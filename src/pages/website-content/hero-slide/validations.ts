import Joi from 'joi'
import type { Media } from '../../../services'
import { linkUrl } from '../shared'

export type HeroSlideFormValues = {
  category: string
  title: string
  description: string
  image: Media | null
  logo: Media | null
  link: string
  isActive: boolean
}

export const heroSlideSchema = Joi.object<HeroSlideFormValues>({
  category: Joi.string().trim().max(80).required().messages({
    'string.empty': 'Category label is required',
    'string.max': 'Category label must be at most 80 characters',
  }),
  title: Joi.string().trim().max(120).required().messages({
    'string.empty': 'Headline is required',
    'string.max': 'Headline must be at most 120 characters',
  }),
  description: Joi.string().trim().max(200).required().messages({
    'string.empty': 'Description is required',
    'string.max': 'Description must be at most 200 characters',
  }),
  image: Joi.object().required().messages({ 'any.required': 'Banner image is required', 'object.base': 'Banner image is required' }),
  logo: Joi.object().allow(null),
  link: linkUrl,
  isActive: Joi.boolean(),
})
