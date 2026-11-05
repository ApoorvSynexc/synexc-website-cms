import Joi from 'joi'
import { assetUrl } from '../shared'

export type TeamMemberFormValues = {
  name: string
  role: string
  bio: string
  photo: string
  linkedin: string
  email: string
  isActive: boolean
}

export const teamMemberSchema = Joi.object<TeamMemberFormValues>({
  name: Joi.string().trim().max(80).required().messages({
    'string.empty': 'Name is required',
    'string.max': 'Name must be at most 80 characters',
  }),
  role: Joi.string().trim().max(80).required().messages({
    'string.empty': 'Job title is required',
    'string.max': 'Job title must be at most 80 characters',
  }),
  bio: Joi.string().trim().min(20).max(300).required().messages({
    'string.empty': 'Short bio is required',
    'string.min': 'Bio must be at least 20 characters',
    'string.max': 'Bio must be at most 300 characters',
  }),
  photo: assetUrl,
  linkedin: Joi.string()
    .trim()
    .pattern(/^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\/\S+$/i)
    .allow('')
    .messages({ 'string.pattern.base': 'Enter a LinkedIn profile link, e.g. https://www.linkedin.com/in/name' }),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .allow('')
    .messages({ 'string.email': 'Enter a valid email address' }),
  isActive: Joi.boolean(),
})
