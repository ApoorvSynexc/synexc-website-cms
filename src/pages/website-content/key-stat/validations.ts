import Joi from 'joi'

export type KeyStatFormValues = {
  stat: string
  title: string
  description: string
  icon: string
  isActive: boolean
}

export const keyStatSchema = Joi.object<KeyStatFormValues>({
  stat: Joi.string()
    .trim()
    .max(10)
    .pattern(/\d/)
    .required()
    .messages({
      'string.empty': 'Figure is required',
      'string.max': 'Keep the figure short, e.g. 24/7 or 100+',
      'string.pattern.base': 'The figure should contain a number, e.g. 12+',
    }),
  title: Joi.string().trim().max(60).required().messages({
    'string.empty': 'Title is required',
    'string.max': 'Title must be at most 60 characters',
  }),
  description: Joi.string().trim().min(20).max(200).required().messages({
    'string.empty': 'Description is required',
    'string.min': 'Description must be at least 20 characters',
    'string.max': 'Description must be at most 200 characters',
  }),
  icon: Joi.string().required().messages({ 'string.empty': 'Choose an icon' }),
  isActive: Joi.boolean(),
})
