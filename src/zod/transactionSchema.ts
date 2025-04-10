import { transactions } from '#/drizzle/schemas'
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from './schemaFactory'

export const selectTransactionSchema = createSelectSchema(transactions)

export const insertTransactionSchema = createInsertSchema(transactions)

export const updateTransactionSchema = createUpdateSchema(transactions)
