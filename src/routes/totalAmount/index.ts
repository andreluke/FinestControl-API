import { registerPrefix } from '#/utils/registerPrefix'
import { getLastAmountRoute } from './getAmountRoute'
import { getMonthAmountRoute } from './getMonthAmountRoute'
import { getRoughAmountRoute } from './getRoughAmountRoute'

const routes = [getLastAmountRoute, getMonthAmountRoute, getRoughAmountRoute]

const prefix = '/total-amount'

export const totalAmountRoutes = registerPrefix(routes, prefix)
