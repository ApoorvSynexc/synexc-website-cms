import Joi from 'joi'

export type CertificationFormValues = {
  title: string
  type: string
  description: string
  icon: string
  isActive: boolean
}

export const certificationSchema = Joi.object<CertificationFormValues>({
  title: Joi.string().trim().max(80).required().messages({
    'string.empty': 'Title is required',
    'string.max': 'Title must be at most 80 characters',
  }),
  type: Joi.string().trim().max(80).required().messages({
    'string.empty': 'Sub-heading is required',
    'string.max': 'Sub-heading must be at most 80 characters',
  }),
  description: Joi.string().trim().min(20).max(250).required().messages({
    'string.empty': 'Description is required',
    'string.min': 'Description must be at least 20 characters',
    'string.max': 'Description must be at most 250 characters',
  }),
  icon: Joi.string().required().messages({ 'string.empty': 'Choose an icon' }),
  isActive: Joi.boolean(),
})
