import Joi from 'joi'
import type { Media } from '../../../services'

export type TestimonialFormValues = {
  name: string
  role: string
  message: string
  avatar: Media | null
  pages: string[]
  isActive: boolean
}

export const testimonialSchema = Joi.object<TestimonialFormValues>({
  name: Joi.string().trim().max(80).required().messages({
    'string.empty': 'Name is required',
    'string.max': 'Name must be at most 80 characters',
  }),
  role: Joi.string().trim().max(100).required().messages({
    'string.empty': 'Role / company is required',
    'string.max': 'Role must be at most 100 characters',
  }),
  message: Joi.string().trim().min(20).max(500).required().messages({
    'string.empty': 'Testimonial text is required',
    'string.min': 'Testimonial must be at least 20 characters',
    'string.max': 'Testimonial must be at most 500 characters',
  }),
  avatar: Joi.object().allow(null),
  pages: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'Pick at least one page',
  }),
  isActive: Joi.boolean(),
})
