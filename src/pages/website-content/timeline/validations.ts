import Joi from 'joi'

export type TimelineFormValues = {
  year: string
  title: string
  description: string
  isActive: boolean
}

export const timelineSchema = Joi.object<TimelineFormValues>({
  year: Joi.string()
    .trim()
    .pattern(/^(19|20)\d{2}$/)
    .required()
    .custom((value: string, helpers) =>
      Number(value) > new Date().getFullYear() + 1 ? helpers.error('year.future') : value,
    )
    .messages({
      'string.empty': 'Year is required',
      'string.pattern.base': 'Enter a four-digit year, e.g. 2023',
      'year.future': 'Year cannot be that far in the future',
    }),
  title: Joi.string().trim().max(80).required().messages({
    'string.empty': 'Title is required',
    'string.max': 'Title must be at most 80 characters',
  }),
  description: Joi.string().trim().min(20).max(300).required().messages({
    'string.empty': 'Description is required',
    'string.min': 'Description must be at least 20 characters',
    'string.max': 'Description must be at most 300 characters',
  }),
  isActive: Joi.boolean(),
})
