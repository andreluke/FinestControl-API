export type TransactionList = {
  id: number
  paymentType: string
  paymentTypeIcon: string
  amount: number
  createdAt: Date | null
  tagName: string
  tagColor: string
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
