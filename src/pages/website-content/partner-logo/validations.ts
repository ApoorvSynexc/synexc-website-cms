import Joi from 'joi'
import type { Media } from '../../../services'
import { linkUrl } from '../shared'

export type PartnerLogoFormValues = {
  name: string
  logo: Media | null
  link: string
  placement: 'PARTNER' | 'CLIENT'
  isActive: boolean
}

export const partnerLogoSchema = Joi.object<PartnerLogoFormValues>({
  name: Joi.string().trim().max(80).required().messages({
    'string.empty': 'Name is required',
    'string.max': 'Name must be at most 80 characters',
  }),
  logo: Joi.object().required().messages({ 'any.required': 'Logo is required', 'object.base': 'Logo is required' }),
  link: linkUrl,
  placement: Joi.string().valid('PARTNER', 'CLIENT').required(),
  isActive: Joi.boolean(),
})
