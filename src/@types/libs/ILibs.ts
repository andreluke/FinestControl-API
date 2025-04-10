import type { db } from '#/drizzle/client'

export type dbType = typeof db

export type TxType = Parameters<typeof db.transaction>[0] extends (
  tx: infer R
) => unknown
  ? R
  : never

export type DbOrTx = dbType | TxType
