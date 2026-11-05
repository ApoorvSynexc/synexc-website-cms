import Joi from 'joi'
import { assetUrl, linkUrl } from '../shared'

export type PartnerLogoFormValues = {
  name: string
  logo: string
  link: string
  placement: 'PARTNER' | 'CLIENT'
  isActive: boolean
}

export const partnerLogoSchema = Joi.object<PartnerLogoFormValues>({
  name: Joi.string().trim().max(80).required().messages({
    'string.empty': 'Name is required',
    'string.max': 'Name must be at most 80 characters',
  }),
  logo: assetUrl.required().messages({
    'string.empty': 'Logo is required',
    'string.pattern.base': 'Enter an http(s) URL or a site path like /client-logo/name.png',
  }),
  link: linkUrl,
  placement: Joi.string().valid('PARTNER', 'CLIENT').required(),
  isActive: Joi.boolean(),
})
