import Joi from 'joi'
import type { SiteSettings } from '../../../services'
import { linkUrl } from '../../website-content/shared'

const httpUrl = (label: string) =>
  Joi.string()
    .trim()
    .uri({ scheme: ['http', 'https'] })
    .allow('')
    .messages({
      'string.uri': `Enter a valid ${label} link starting with https://`,
      'string.uriCustomScheme': `Enter a valid ${label} link starting with https://`,
    })

export const siteSettingsSchema = Joi.object<SiteSettings>({
  phone: Joi.string()
    .trim()
    .pattern(/^\+?[0-9][0-9\s-]{6,18}$/)
    .required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Enter a valid phone number, e.g. +91 9810512585',
    }),
  phoneHours: Joi.string().trim().max(80).allow('').messages({ 'string.max': 'Keep this under 80 characters' }),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Enter a valid email address',
    }),
  emailNote: Joi.string().trim().max(80).allow('').messages({ 'string.max': 'Keep this under 80 characters' }),
  whatsapp: Joi.string()
    .trim()
    .pattern(/^\d{8,15}$/)
    .allow('')
    .messages({ 'string.pattern.base': 'Digits only with country code, e.g. 919910189504' }),
  companyName: Joi.string().trim().max(100).required().messages({
    'string.empty': 'Company name is required',
    'string.max': 'Company name must be at most 100 characters',
  }),
  address: Joi.string().trim().max(300).required().messages({
    'string.empty': 'Address is required',
    'string.max': 'Address must be at most 300 characters',
  }),
  facebook: httpUrl('Facebook'),
  linkedin: httpUrl('LinkedIn'),
  instagram: httpUrl('Instagram'),
  copyrightName: Joi.string().trim().max(100).required().messages({
    'string.empty': 'Copyright name is required',
    'string.max': 'Copyright name must be at most 100 characters',
  }),
  privacyUrl: linkUrl,
  termsUrl: linkUrl,
})
