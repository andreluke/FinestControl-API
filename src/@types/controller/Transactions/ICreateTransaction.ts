export interface CreateTransactionParams {
  amount: number
  isSpend: boolean
  paymentTypeId: number
  tagId: number
  createdAt?: Date
}
