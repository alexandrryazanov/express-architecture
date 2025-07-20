import * as joi from '@hapi/joi'
import 'joi-extract-type'

export const createCategoryDto = joi.object({
  name: joi.string().required(),
  description: joi.string().required(),
  isActive: joi.boolean().optional().default(true),
})

export type CreateCategoryDto = joi.extractType<typeof createCategoryDto>
