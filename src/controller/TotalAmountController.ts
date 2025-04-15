import { and, desc, gte, lte } from 'drizzle-orm'
import type {
  CreateAmountParams,
  GetMonthAmountParams,
} from '#/@types/controller/TotalAmount'
import type { DbOrTx } from '#/@types/libs'
import { totalAmount } from '#/drizzle/schemas'
import { TotalAmountNotFoundError } from '#/errors/custom/TotalAmountError'
import { TotalAmountModel } from '#/model/TransactionModel'

export class TotalAmountController {
  constructor(private readonly db: DbOrTx) {}

  async getAmount() {
    const [totalAmountValue] = await this.db
      .select()
      .from(totalAmount)
      .orderBy(desc(totalAmount.createdAt))
      .limit(1)

    return totalAmountValue
  }

  async createAmount({ amount, isSpend, transactionId }: CreateAmountParams) {
    const totalAmountModel = new TotalAmountModel(this.db, totalAmount)
    const { total } = (await this.getAmount()) ?? 0
    const lastAmount = total ?? 0
    const newTotal = isSpend ? lastAmount - amount : lastAmount + amount

    const totalAmountValue = await totalAmountModel.insertAmount({
      total: newTotal,
      lastAmount,
      transactionId,
    })

    return totalAmountValue
  }

  async getMonthAmount({ month, year: baseYear, last }: GetMonthAmountParams) {
    const year = baseYear ?? new Date().getFullYear()

    const monthStart = new Date(year, month - 1, 1)
    const monthEnd = new Date(year, month, 0, 23, 59, 59, 999)

    const query = this.db
      .select()
      .from(totalAmount)
      .where(
        and(
          gte(totalAmount.createdAt, monthStart),
          lte(totalAmount.createdAt, monthEnd)
        )
      )
      .orderBy(desc(totalAmount.createdAt))

    if (last) {
      query.limit(1)
    }

    const totalAmountValue = await query

    if (Array.isArray(totalAmountValue) && totalAmountValue.length === 0) {
      throw new TotalAmountNotFoundError()
    }

    return totalAmountValue
  }
}
