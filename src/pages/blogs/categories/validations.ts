import Joi from 'joi'

export type CategoryFormValues = {
  name: string
}

export const categorySchema = Joi.object<CategoryFormValues>({
  name: Joi.string().trim().max(80).required().messages({
    'string.empty': 'Category name is required',
    'string.max': 'Category name must be at most 80 characters',
  }),
})
