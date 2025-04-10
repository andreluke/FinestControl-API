import { paymentTypeRoutes } from './paymentType'
import { tagsRoutes } from './tags'
import { totalAmountRoutes } from './totalAmount'
import { transactionsRoutes } from './transactions'

export const routes = [
  transactionsRoutes,
  totalAmountRoutes,
  tagsRoutes,
  paymentTypeRoutes,
]
