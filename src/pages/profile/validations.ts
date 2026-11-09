import Joi from 'joi'
import type { Media } from '../../services'

export type ProfileFormValues = {
  name: string
  avatar: Media | null
}

export const profileSchema = Joi.object<ProfileFormValues>({
  name: Joi.string().trim().max(100).required().messages({
    'string.empty': 'Name is required',
    'string.max': 'Name must be at most 100 characters',
  }),
  avatar: Joi.object().allow(null),
})

export type PasswordFormValues = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export const passwordSchema = Joi.object<PasswordFormValues>({
  currentPassword: Joi.string().required().messages({ 'string.empty': 'Current password is required' }),
  newPassword: Joi.string()
    .min(8)
    .max(64)
    .pattern(/[A-Za-z]/, 'letter')
    .pattern(/\d/, 'number')
    .required()
    .messages({
      'string.empty': 'New password is required',
      'string.min': 'New password must be at least 8 characters',
      'string.max': 'New password must be at most 64 characters',
      'string.pattern.name': 'New password needs at least one letter and one number',
    }),
  confirmPassword: Joi.any().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Confirm your new password',
  }),
})
