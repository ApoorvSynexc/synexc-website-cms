import Joi from 'joi'
import type { AnnouncementType, Media } from '../../../services'

export type AnnouncementFormValues = {
  badge: string
  title: string
  message: string
  type: AnnouncementType
  eventDate: string
  venue: string
  ctaLabel: string
  ctaUrl: string
  /** The uploaded logo / image (its id is what gets saved), or null. */
  image: Media | null
  startDate: string
  endDate: string
  isActive: boolean
}

const date = Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/)

export const announcementSchema = Joi.object<AnnouncementFormValues>({
  badge: Joi.string().trim().max(60).allow('').messages({
    'string.max': 'Badge must be at most 60 characters',
  }),
  title: Joi.string().trim().max(120).required().messages({
    'string.empty': 'Headline is required',
    'string.max': 'Headline must be at most 120 characters',
  }),
  message: Joi.string().trim().max(250).required().messages({
    'string.empty': 'Message is required',
    'string.max': 'Message must be at most 250 characters',
  }),
  type: Joi.string().valid('POPUP', 'BANNER').required(),
  eventDate: date.allow('').messages({ 'string.pattern.base': 'Enter a valid date' }),
  venue: Joi.string().trim().max(120).allow('').messages({
    'string.max': 'Venue must be at most 120 characters',
  }),
  ctaLabel: Joi.string().trim().max(40).allow('').messages({
    'string.max': 'Button text must be at most 40 characters',
  }),
  ctaUrl: Joi.string()
    .trim()
    .uri({ scheme: ['http', 'https'] })
    .allow('')
    .messages({
      'string.uri': 'Enter a valid http(s) link',
      'string.uriCustomScheme': 'Enter a valid link starting with https://',
    }),
  image: Joi.object().allow(null).messages({ 'object.base': 'Upload a valid image' }),
  startDate: date.required().messages({
    'string.empty': 'Start date is required',
    'string.pattern.base': 'Enter a valid date',
  }),
  endDate: date
    .required()
    .custom((value: string, helpers) => {
      const start = (helpers.state.ancestors[0] as AnnouncementFormValues).startDate
      return start && value < start ? helpers.error('date.order') : value
    })
    .messages({
      'string.empty': 'End date is required',
      'string.pattern.base': 'Enter a valid date',
      'date.order': 'End date must be on or after the start date',
    }),
  isActive: Joi.boolean(),
})
