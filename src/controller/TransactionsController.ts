import { and, desc, eq, gte, isNull, lte } from 'drizzle-orm'
import type {
  CreateTransactionParams,
  GetAllTransactionParams,
  GetAllTransactionWithMonthParams,
  GetTransactionParams,
  GetTransactionPaymentType,
  GetTransactionTagParams,
  GetTransactionsMonthParams,
} from '#/@types/controller/Transactions'
import type { DbOrTx } from '#/@types/libs'
import { Money } from '#/class/Money'
import { TransactionHelper } from '#/class/TransactionHelper'
import { paymentType, tags, transactions } from '#/drizzle/schemas'
import {
  MissingTransactionParamsError,
  TransactionNotFoundError,
} from '#/errors/custom/TransactionError'
import { PaymentTypeController } from './PaymentTypeController'
import { TagsController } from './TagsController'
import { TotalAmountController } from './TotalAmountController'

export class TransactionsController {
  private notRemovedCondition = () => isNull(transactions.removedAt)
  private paymentTypeController: PaymentTypeController
  private tagController: TagsController

  constructor(private readonly db: DbOrTx) {
    this.paymentTypeController = new PaymentTypeController(this.db)
    this.tagController = new TagsController(this.db)
  }

  async getTransaction({ transactionId }: GetTransactionParams) {
    const query = this.db
      .select({
        id: transactions.id,
        paymentType: paymentType.name,
        tagName: tags.name,
        tagColor: tags.color,
        amount: transactions.amount,
        createdAt: transactions.createdAt,
        isSpend: transactions.isSpend,
      })
      .from(transactions)
      .where(
        and(this.notRemovedCondition(), eq(transactions.id, transactionId))
      )
      .innerJoin(paymentType, eq(transactions.paymentTypeId, paymentType.id))
      .innerJoin(tags, eq(transactions.tagId, tags.id))
      .orderBy(transactions.createdAt)

    const [transaction] = await query

    if (!transaction) {
      throw new TransactionNotFoundError()
    }

    return transaction
  }

  async getAllTransactionsPaymentType({
    paymentId,
    paymentTypeName,
    limit,
  }: GetTransactionPaymentType) {
    if (!paymentId && !paymentTypeName) {
      throw new MissingTransactionParamsError()
    }
    const id =
      paymentId ??
      (
        await this.paymentTypeController.getPaymentType({
          name: paymentTypeName,
        })
      ).id

    const query = this.db
      .select({
        id: transactions.id,
        paymentType: paymentType.name,
        tagName: tags.name,
        tagColor: tags.color,
        amount: transactions.amount,
        createdAt: transactions.createdAt,
        isSpend: transactions.isSpend,
      })
      .from(transactions)
      .where(
        and(this.notRemovedCondition(), eq(transactions.paymentTypeId, id))
      )
      .innerJoin(paymentType, eq(transactions.paymentTypeId, paymentType.id))
      .innerJoin(tags, eq(transactions.tagId, tags.id))
      .orderBy(transactions.createdAt)

    if (limit) query.limit(limit)

    const paymentTransactions = await query

    if (paymentTransactions.length === 0) {
      throw new TransactionNotFoundError()
    }

    return paymentTransactions
  }

  async getAllTransactionsTag({
    tagId,
    tagName,
    limit,
  }: GetTransactionTagParams) {
    if (!tagId && !tagName) {
      throw new MissingTransactionParamsError()
    }

    const id =
      tagId ??
      (
        await this.tagController.getTag({
          name: tagName,
        })
      ).id

    const query = this.db
      .select({
        id: transactions.id,
        paymentType: paymentType.name,
        tagName: tags.name,
        tagColor: tags.color,
        tagGoal: tags.monthGoal,
        amount: transactions.amount,
        createdAt: transactions.createdAt,
        isSpend: transactions.isSpend,
      })
      .from(transactions)
      .where(
        and(this.notRemovedCondition(), eq(transactions.paymentTypeId, id))
      )
      .innerJoin(paymentType, eq(transactions.paymentTypeId, paymentType.id))
      .innerJoin(tags, eq(transactions.tagId, tags.id))
      .orderBy(transactions.createdAt)

    if (limit) query.limit(limit)

    const tagTransactions = await query

    if (tagTransactions.length === 0) {
      throw new TransactionNotFoundError()
    }

    return tagTransactions
  }

  async getAllTransactions({ limit }: GetAllTransactionParams) {
    const query = this.db
      .select({
        id: transactions.id,
        paymentType: paymentType.name,
        paymentTypeIcon: paymentType.icon,
        amount: transactions.amount,
        createdAt: transactions.createdAt,
        tagName: tags.name,
        tagColor: tags.color,
        isSpend: transactions.isSpend,
      })
      .from(transactions)
      .innerJoin(paymentType, eq(transactions.paymentTypeId, paymentType.id))
      .innerJoin(tags, eq(transactions.tagId, tags.id))
      .where(this.notRemovedCondition())
      .orderBy(desc(transactions.createdAt))

    if (limit) query.limit(limit)

    const transactionsList = await query

    const transactionHelperInstance = new TransactionHelper(transactionsList)
    const separatedTransactions = transactionHelperInstance.separateByMonth()

    return separatedTransactions
  }

  async getAllTransactionsWithMonth({
    month,
    year,
  }: GetAllTransactionWithMonthParams) {
    const now = new Date()
    const currentYear = year ? year : now.getFullYear()
    const currentMonth = now.getMonth() + 1

    const monthStart = month
      ? new Date(currentYear, month - 1, 1)
      : new Date(currentYear, currentMonth - 4, 1)

    const query = this.db
      .select({
        id: transactions.id,
        paymentType: paymentType.name,
        paymentTypeIcon: paymentType.icon,
        amount: transactions.amount,
        createdAt: transactions.createdAt,
        tagName: tags.name,
        tagColor: tags.color,
        isSpend: transactions.isSpend,
      })
      .from(transactions)
      .innerJoin(paymentType, eq(transactions.paymentTypeId, paymentType.id))
      .innerJoin(tags, eq(transactions.tagId, tags.id))
      .where(
        and(this.notRemovedCondition(), gte(transactions.createdAt, monthStart))
      )
      .orderBy(desc(transactions.createdAt))

    const transactionsList = await query

    const transactionHelperInstance = new TransactionHelper(transactionsList)
    const separatedTransactions =
      transactionHelperInstance.separateByMonthWithTotals()

    return separatedTransactions
  }

  async getAllTransactionsByMonth({
    month,
    year: baseYear,
  }: GetTransactionsMonthParams) {
    const year = baseYear ?? new Date().getFullYear()

    const monthStart = new Date(year, month - 1, 1)
    const monthEnd = new Date(year, month, 0, 23, 59, 59, 999)

    const query = this.db
      .select({
        id: transactions.id,
        paymentType: paymentType.name,
        paymentTypeIcon: paymentType.icon,
        amount: transactions.amount,
        createdAt: transactions.createdAt,
        tagName: tags.name,
        tagColor: tags.color,
        isSpend: transactions.isSpend,
      })
      .from(transactions)
      .innerJoin(paymentType, eq(transactions.paymentTypeId, paymentType.id))
      .innerJoin(tags, eq(transactions.tagId, tags.id))
      .where(
        and(
          this.notRemovedCondition(),
          gte(transactions.createdAt, monthStart),
          lte(transactions.createdAt, monthEnd)
        )
      )
      .orderBy(desc(transactions.createdAt))

    const transactionsList = await query

    const transactionHelperInstance = new TransactionHelper(transactionsList)

    return {
      month: month,
      year: year,
      transactions: transactionHelperInstance.separateSpends(),
    }
  }

  async createTransaction({
    amount,
    isSpend,
    paymentTypeId,
    tagId,
    createdAt,
  }: CreateTransactionParams) {
    const payment = new Money(amount)

    const paymentType = await this.paymentTypeController.getPaymentType({
      typeId: paymentTypeId,
    })

    const tag = await this.tagController.getTag({
      tagId,
    })

    const result = await this.db.transaction(async tx => {
      const totalAmountController = new TotalAmountController(tx)

      const [newTransaction] = await tx
        .insert(transactions)
        .values({
          amount: payment.getCents(),
          isSpend,
          paymentTypeId: paymentType.id,
          tagId: tag.id,
          createdAt: createdAt ?? new Date(),
        })
        .returning()

      await totalAmountController.createAmount({
        amount: payment.getCents(),
        isSpend,
        transactionId: newTransaction.id,
      })

      return newTransaction
    })

    return result
  }
}

// class GetTransactionMethods {

// }
