import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'

export const tags = pgTable('tags', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  color: varchar('color', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
  removedAt: timestamp('removed_at'),
})
