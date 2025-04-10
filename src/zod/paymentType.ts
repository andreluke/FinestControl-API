import { paymentType } from '#/drizzle/schemas'
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from './schemaFactory'

export const selectPaymentTypeSchema = createSelectSchema(paymentType)

export const insertPaymentTypeSchema = createInsertSchema(paymentType)

export const updatePaymentTypeSchema = createUpdateSchema(paymentType)
