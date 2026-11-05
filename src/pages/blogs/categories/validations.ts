import Joi from 'joi'

export type CategoryFormValues = {
  name: string
  slug: string
}

export const categorySchema = Joi.object<CategoryFormValues>({
  name: Joi.string().trim().max(80).required().messages({
    'string.empty': 'Category name is required',
    'string.max': 'Category name must be at most 80 characters',
  }),
  slug: Joi.string()
    .trim()
    .max(100)
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required()
    .messages({
      'string.empty': 'Slug is required',
      'string.max': 'Slug must be at most 100 characters',
      'string.pattern.base': 'Use lowercase letters, numbers and single hyphens only',
    }),
})
