import Joi from 'joi'
import type { Media } from '../../../services'

export type GalleryFormValues = {
  image: Media | null
  caption: string
  album: string
  isActive: boolean
}

export const gallerySchema = Joi.object<GalleryFormValues>({
  image: Joi.object().required().messages({ 'any.required': 'Image is required', 'object.base': 'Image is required' }),
  caption: Joi.string().trim().max(120).allow('').messages({
    'string.max': 'Caption must be at most 120 characters',
  }),
  album: Joi.string().required().messages({ 'string.empty': 'Select an album' }),
  isActive: Joi.boolean(),
})
