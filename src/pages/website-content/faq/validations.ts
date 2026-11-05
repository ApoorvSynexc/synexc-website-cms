import Joi from 'joi'

export type FaqFormValues = {
  question: string
  answer: string
  group: string
  isActive: boolean
}

export const faqSchema = Joi.object<FaqFormValues>({
  question: Joi.string().trim().max(250).required().messages({
    'string.empty': 'Question is required',
    'string.max': 'Question must be at most 250 characters',
  }),
  answer: Joi.string().trim().min(10).max(1200).required().messages({
    'string.empty': 'Answer is required',
    'string.min': 'Answer must be at least 10 characters',
    'string.max': 'Answer must be at most 1200 characters',
  }),
  group: Joi.string().required().messages({ 'string.empty': 'Select where this FAQ is shown' }),
  isActive: Joi.boolean(),
})
