import { registerPrefix } from '#/utils/registerPrefix'
import { createTransactionRoute } from './createTransaction'
import { getAllTransactionsByMonthRoute } from './getAllTransactionsByMonthRoute'
import { getAllTransactionsPaymentTypeRoute } from './getAllTransactionsPaymentTypeRoute'
import { getAllTransactionsRoute } from './getAllTransactionsRoute'
import { getAllTransactionsTagRoute } from './getAllTransactionsTagRoute'
import { getAllTransactionsWithMonthRoute } from './getAllTransactionsWithMonthRoute'
import { getTransactionRoute } from './getTransactionRoute'

const routes = [
  getAllTransactionsRoute,
  getTransactionRoute,
  getAllTransactionsPaymentTypeRoute,
  getAllTransactionsTagRoute,
  getAllTransactionsByMonthRoute,
  getAllTransactionsWithMonthRoute,
  createTransactionRoute,
]
const prefix = '/transactions'

export const transactionsRoutes = registerPrefix(routes, prefix)
