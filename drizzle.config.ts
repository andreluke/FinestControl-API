import type { Config } from 'drizzle-kit'
import { env } from './src/settings/env'

export default {
  schema: './src/drizzle/schemas/*',
  out: './src/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
} satisfies Config
