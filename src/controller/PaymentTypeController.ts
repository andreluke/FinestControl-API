import { and, desc, eq, isNotNull, isNull } from 'drizzle-orm'
import type {
  CreatePaymentTypeParams,
  GetPaymentTypeParams,
  RemovePaymentTypeParams,
  UpdatePaymentTypeParams,
} from '#/@types/controller/PaymentType'
import type { DbOrTx } from '#/@types/libs'
import { paymentType } from '#/drizzle/schemas'
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

  async createPaymentType({ name, description }: CreatePaymentTypeParams) {
    const paymentTypeExists = await this.getPaymentType({ name })

    if (paymentTypeExists) {
      throw new PaymentTypeAlreadyExistsError()
    }

    const [newPaymentType] = await this.db
      .insert(paymentType)
      .values({ name, description })
      .returning()

    return newPaymentType
  }

  async updatePaymentType({
    typeId,
    name,
    description,
  }: UpdatePaymentTypeParams) {
    if (!name && !description) {
      throw new PaymentTypeMissingParamsError()
    }

    const [newPaymentType] = await this.db
      .update(paymentType)
      .set({
        name,
        description,
        updatedAt: new Date(),
      })
      .where(and(this.notRemovedCondition(), eq(paymentType.id, typeId)))
      .returning()

    if (!newPaymentType) {
      throw new PaymentTypeNotFoundError()
    }

    return newPaymentType
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
