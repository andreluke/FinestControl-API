export type TransactionList = {
  id: number
  paymentType: string
  amount: number
  createdAt: Date | null
  tag: string
  isSpend: boolean
}

export type MonthlyTransactionSummary = {
  [month: string]: {
    spends: TransactionList[]
    incomes: TransactionList[]
    details: {
      totalSpends: number
      totalIncomes: number
      overallBalance: number
    }
  }
}
