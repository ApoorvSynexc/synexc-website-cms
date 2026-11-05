import Joi from 'joi'
import type { UserStatus } from '../../../../services'

export type UserFormValues = {
  name: string
  email: string
  password: string
  roleId: string
  status: UserStatus
}

const base = {
  name: Joi.string().trim().max(100).required().messages({
    'string.empty': 'Name is required',
    'string.max': 'Name must be at most 100 characters',
  }),
  email: Joi.string()
    .trim()
    .max(150)
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Enter a valid email address',
      'string.max': 'Email must be at most 150 characters',
    }),
  roleId: Joi.string().required().messages({ 'string.empty': 'Select a role' }),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').required(),
}

const passwordRules = Joi.string()
  .min(8)
  .max(64)
  .pattern(/[A-Za-z]/, 'letter')
  .pattern(/\d/, 'number')
  .messages({
    'string.min': 'At least 8 characters',
    'string.max': 'Password must be at most 64 characters',
    'string.pattern.name': 'Include at least one letter and one number',
  })

export const createUserSchema = Joi.object<UserFormValues>({
  ...base,
  password: passwordRules.required().messages({ 'string.empty': 'Password is required' }),
})

/** On edit the password is optional — blank keeps the current one. */
export const updateUserSchema = Joi.object<UserFormValues>({
  ...base,
  password: passwordRules.allow(''),
})
