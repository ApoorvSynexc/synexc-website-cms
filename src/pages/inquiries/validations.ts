import Joi from 'joi'
import type { InquiryStatus } from '../../services'

export type InquiryFormValues = {
  status: InquiryStatus
  assigneeId: string
  notes: string
}

export const inquirySchema = Joi.object<InquiryFormValues>({
  status: Joi.string().valid('NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED').required(),
  assigneeId: Joi.string().allow(''),
  notes: Joi.string().trim().max(1000).allow('').messages({
    'string.max': 'Notes must be at most 1000 characters',
  }),
})
