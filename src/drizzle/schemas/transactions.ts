import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core'
import { paymentType } from './paymentType'
import { tags } from './tags'

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  amount: integer('amount').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  isSpend: boolean('is_spend').notNull(),
  paymentTypeId: serial('payment_type_id')
    .references(() => paymentType.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    })
    .notNull(),
  tagId: serial('tag_id')
    .references(() => tags.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    })
    .notNull(),
  removedAt: timestamp('removed_at'),
})
