import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core'
import { transactions } from './transactions'

export const totalAmount = pgTable('total_amount', {
  id: serial('id').primaryKey(),
  total: integer('total_amount').notNull(),
  lastAmount: integer('last_amount'),
  createdAt: timestamp('created_at').defaultNow(),
  lastTransaction: serial('last_spend').references(() => transactions.id, {
    onDelete: 'set null',
    onUpdate: 'cascade',
  }),
})
