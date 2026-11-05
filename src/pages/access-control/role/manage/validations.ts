import Joi from 'joi'

export type RoleFormValues = {
  name: string
  description: string
}

export const roleSchema = Joi.object<RoleFormValues>({
  name: Joi.string()
    .trim()
    .max(80)
    .required()
    .custom((value: string, helpers) =>
      value.toLowerCase() === 'admin' ? helpers.error('name.reserved') : value,
    )
    .messages({
      'string.empty': 'Role name is required',
      'string.max': 'Role name must be at most 80 characters',
      'name.reserved': 'The name "Admin" is reserved',
    }),
  description: Joi.string().trim().max(300).allow('').messages({
    'string.max': 'Description must be at most 300 characters',
  }),
})
