import { registerPrefix } from '#/utils/registerPrefix'
import { getLastAmountRoute } from './getAmountRoute'
import { getMonthAmountRoute } from './getMonthAmountRoute'

const routes = [getLastAmountRoute, getMonthAmountRoute]

const prefix = '/total-amount'

export const totalAmountRoutes = registerPrefix(routes, prefix)
