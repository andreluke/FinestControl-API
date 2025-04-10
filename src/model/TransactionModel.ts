import type { DbOrTx } from '#/@types/libs'
import type { InsertAmountParams } from '#/@types/model/TotalAmount'
import type { totalAmount } from '#/drizzle/schemas'

type TotalAmount = typeof totalAmount

export class TotalAmountModel {
  constructor(
    private readonly db: DbOrTx,
    private readonly totalAmount: TotalAmount
  ) {}

  async insertAmount({ total, lastAmount, transactionId }: InsertAmountParams) {
    const [totalAmountValue] = await this.db
      .insert(this.totalAmount)
      .values({ total, lastAmount, lastTransaction: transactionId })
      .returning()

    return totalAmountValue
  }
}
