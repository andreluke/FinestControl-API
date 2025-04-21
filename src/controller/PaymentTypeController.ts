import { and, count, desc, eq, gte, isNotNull, isNull, lte } from 'drizzle-orm'
import type {
  CreatePaymentTypeParams,
  GetPaymentTypeParams,
  RemovePaymentTypeParams,
  UpdatePaymentTypeParams,
} from '#/@types/controller/PaymentType'
import type { GetMostUsedPaymentTypesParams } from '#/@types/controller/PaymentType/IGetMostUsedPaymentTypes'
import type { DbOrTx } from '#/@types/libs'
import { paymentType, transactions } from '#/drizzle/schemas'
import {
  PaymentTypeAlreadyExistsError,
  PaymentTypeMissingParamsError,
  PaymentTypeNotFoundError,
} from '#/errors/custom/PaymentTypeError'

export class PaymentTypeController {
  private notRemovedCondition = () => isNull(paymentType.removedAt)
  constructor(private readonly db: DbOrTx) {}

  async getPaymentType({ typeId, name, search }: GetPaymentTypeParams) {
    if (!name && !typeId) {
      throw new PaymentTypeMissingParamsError()
    }

    const id = typeId ?? 0

    const equal = name ? eq(paymentType.name, name) : eq(paymentType.id, id)

    const query = this.db.select().from(paymentType)

    const [newPaymentType] = await query.where(
      and(this.notRemovedCondition(), equal)
    )

    if (!newPaymentType && !search) {
      throw new PaymentTypeNotFoundError()
    }

    return newPaymentType
  }

  async createPaymentType({
    name,
    description,
    icon,
  }: CreatePaymentTypeParams) {
    const paymentTypeExists = await this.getPaymentType({ name, search: true })

    if (paymentTypeExists) {
      throw new PaymentTypeAlreadyExistsError()
    }

    const [newPaymentType] = await this.db
      .insert(paymentType)
      .values({ name, description, icon })
      .returning()

    return newPaymentType
  }

  async updatePaymentType({
    typeId,
    name,
    description,
    icon,
  }: UpdatePaymentTypeParams) {
    if (!name && !description && !icon) {
      throw new PaymentTypeMissingParamsError()
    }

    if (name) {
      const paymentTypeExists = await this.getPaymentType({
        name,
        search: true,
      })

      if (paymentTypeExists && paymentTypeExists.id !== typeId) {
        throw new PaymentTypeAlreadyExistsError()
      }
    }

    const [newPaymentType] = await this.db
      .update(paymentType)
      .set({
        name,
        description,
        icon,
        updatedAt: new Date(),
      })
      .where(and(this.notRemovedCondition(), eq(paymentType.id, typeId)))
      .returning()

    if (!newPaymentType) {
      throw new PaymentTypeNotFoundError()
    }

    return newPaymentType
  }

  async getMostUsedPaymentType({ limit }: GetMostUsedPaymentTypesParams) {
    const now = new Date()

    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0
    )
    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    )

    const query = this.db
      .select({
        id: paymentType.id,
        name: paymentType.name,
        icon: paymentType.icon,
        usageCount: count(transactions.id).as('usage_count'),
      })
      .from(paymentType)
      .leftJoin(transactions, eq(paymentType.id, transactions.paymentTypeId))
      .groupBy(paymentType.id, paymentType.name)
      .orderBy(desc(count(transactions.id)))
      .where(
        and(
          gte(transactions.createdAt, monthStart),
          lte(transactions.createdAt, monthEnd)
        )
      )
      .limit(limit ?? 10)

    const tagsList = await query

    const filteredTagsList = tagsList.filter(tag => {
      return tag.usageCount > 0
    })

    return filteredTagsList
  }

  async removePaymentType({ typeId }: RemovePaymentTypeParams) {
    const [newPaymentType] = await this.db
      .update(paymentType)
      .set({
        removedAt: new Date(),
      })
      .where(and(this.notRemovedCondition(), eq(paymentType.id, typeId)))
      .returning()

    if (!newPaymentType) {
      throw new PaymentTypeNotFoundError()
    }

    return newPaymentType
  }

  async getAllPaymentTypes() {
    const paymentTypes = await this.db
      .select()
      .from(paymentType)
      .where(this.notRemovedCondition())
      .orderBy(desc(paymentType.createdAt))

    return paymentTypes
  }

  async getAllRemovedPaymentTypes() {
    const paymentTypes = await this.db
      .select()
      .from(paymentType)
      .where(isNotNull(paymentType.removedAt))
      .orderBy(desc(paymentType.createdAt))

    return paymentTypes
  }

  async restorePaymentType({ typeId }: RemovePaymentTypeParams) {
    const [newPaymentType] = await this.db
      .update(paymentType)
      .set({
        removedAt: null,
      })
      .where(and(isNotNull(paymentType.removedAt), eq(paymentType.id, typeId)))
      .returning()

    if (!newPaymentType) {
      throw new PaymentTypeNotFoundError()
    }

    return newPaymentType
  }
}
