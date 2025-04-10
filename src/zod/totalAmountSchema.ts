import { totalAmount } from '#/drizzle/schemas'
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from './schemaFactory'

export const selectTotalAmountSchema = createSelectSchema(totalAmount)

export const insertTotalAmountSchema = createInsertSchema(totalAmount)

export const updateTotalAmountSchema = createUpdateSchema(totalAmount)
