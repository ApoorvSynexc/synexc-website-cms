import Joi from 'joi'
import { assetUrl } from '../shared'

export type GalleryFormValues = {
  image: string
  caption: string
  album: string
  isActive: boolean
}

export const gallerySchema = Joi.object<GalleryFormValues>({
  image: assetUrl.required().messages({
    'string.empty': 'Image is required',
    'string.pattern.base': 'Enter an http(s) URL or a site path like /about1.png',
  }),
  caption: Joi.string().trim().max(120).allow('').messages({
    'string.max': 'Caption must be at most 120 characters',
  }),
  album: Joi.string().required().messages({ 'string.empty': 'Select an album' }),
  isActive: Joi.boolean(),
})
