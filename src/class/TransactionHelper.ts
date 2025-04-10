import type {
  MonthlyTransactionSummary,
  TransactionList,
} from '#/@types/controller/Transactions'
import { Money } from './Money'

export class TransactionHelper {
  constructor(private readonly transactionList: TransactionList[]) {}
  separateSpends() {
    const spends = this.transactionList.filter(
      transaction => transaction.isSpend
    )
    const incomes = this.transactionList.filter(
      transaction => !transaction.isSpend
    )

    const totalSpends = spends.reduce(
      (acc: Money, curr) => acc.add(new Money(curr.amount)),
      new Money(0)
    )

    const totalIncomes = incomes.reduce(
      (acc: Money, curr) => acc.add(new Money(curr.amount)),
      new Money(0)
    )

    const overallBalance = totalIncomes.subtract(totalSpends)

    return {
      spends,
      incomes,
      details: {
        totalSpends: totalSpends.getReais(),
        totalIncomes: totalIncomes.getReais(),
        overallBalance: overallBalance.getReais(),
      },
    }
  }

  separateByMonth() {
    return this.transactionList.reduce(
      (months, transaction) => {
        if (transaction.createdAt) {
          const monthKey = `${transaction.createdAt.getFullYear()}-${transaction.createdAt.getMonth() + 1}` // Ex: "2025-4"

          // If this month doesn't exist in the months object, create it
          if (!months[monthKey]) {
            months[monthKey] = []
          }

          months[monthKey].push(transaction)
        }
        return months
      },
      {} as { [month: string]: TransactionList[] }
    )
  }

  separateByMonthWithTotals(): MonthlyTransactionSummary {
    const groupedByMonth = this.separateByMonth()

    const result: MonthlyTransactionSummary = {}

    for (const [month, transactions] of Object.entries(groupedByMonth)) {
      const spends = transactions.filter(t => t.isSpend)
      const incomes = transactions.filter(t => !t.isSpend)

      const totalSpends = spends.reduce(
        (acc: Money, curr) => acc.add(new Money(curr.amount)),
        new Money(0)
      )

      const totalIncomes = incomes.reduce(
        (acc: Money, curr) => acc.add(new Money(curr.amount)),
        new Money(0)
      )

      const overallBalance = totalIncomes.subtract(totalSpends)

      result[month] = {
        spends,
        incomes,
        details: {
          totalSpends: totalSpends.getReais(),
          totalIncomes: totalIncomes.getReais(),
          overallBalance: overallBalance.getReais(),
        },
      }
    }

    return result
  }
}
