import { registerPrefix } from '#/utils/registerPrefix'
import { createPaymentTypeRoute } from './createPaymentTypeRoute'
import { getPaymentTypesRoute } from './getAllPaymentTypesRoute'
import { getRemovedPaymentTypesRoute } from './getAllRemovedPaymentTypesRoute'
import { getPaymentTypeRoute } from './getPaymentTypeRoute'
import { removePaymentTypeRoute } from './removePaymentTypeRoute'
import { restorePaymentTypeRoute } from './restorePaymentType'
import { updatePaymentTypeRoute } from './updatePaymentTypeRoute'

const routes = [
  getPaymentTypesRoute,
  getRemovedPaymentTypesRoute,
  getPaymentTypeRoute,
  createPaymentTypeRoute,
  updatePaymentTypeRoute,
  removePaymentTypeRoute,
  restorePaymentTypeRoute,
]

const prefix = '/payment-type'

export const paymentTypeRoutes = registerPrefix(routes, prefix)
