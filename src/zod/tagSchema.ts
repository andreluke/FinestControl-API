import { tags } from '#/drizzle/schemas'
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from './schemaFactory'

export const selectTagSchema = createSelectSchema(tags)

export const insertTagSchema = createInsertSchema(tags)

export const updateTagSchema = createUpdateSchema(tags)
