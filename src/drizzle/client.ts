import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '../settings/env'
import { paymentType, tags, totalAmount, transactions } from './schemas'

export const pg = postgres(env.POSTGRES_URL, {})
export const db = drizzle(pg, {
  schema: {
    transactions,
    paymentType,
    totalAmount,
    tags,
  },
})
