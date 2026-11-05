import Joi from 'joi'
import { assetUrl, linkUrl } from '../shared'

export type HeroSlideFormValues = {
  category: string
  title: string
  description: string
  image: string
  logo: string
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
  image: assetUrl.required().messages({
    'string.empty': 'Banner image is required',
    'string.pattern.base': 'Enter an http(s) URL or a site path like /banners/banner.jpg',
  }),
  logo: assetUrl,
  link: linkUrl,
  isActive: Joi.boolean(),
})
