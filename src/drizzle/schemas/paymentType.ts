import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'

export const paymentType = pgTable('payment_type', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
  removedAt: timestamp('removed_at'),
})
