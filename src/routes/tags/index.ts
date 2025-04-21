import { registerPrefix } from '#/utils/registerPrefix'
import { createTagRoute } from './createTagRoute'
import { getRemovedTagsRoute } from './getAllRemovedTagsRoute'
import { getTagsRoute } from './getAllTagsRoute'
import { getMostUsedTagsRoute } from './getMostUsedTags'
import { downloadTagsWithSpendsRoute } from './getSpreadsheet'
import { getTagRoute } from './getTagRoute'
import { getTagsWithSpendsRoute } from './getTagsWithSpendsRoute'
import { removeTagRoute } from './removeTagRoute'
import { restoreTagRoute } from './restoreTagRoute'
import { updateTagRoute } from './updateTagRoute'

const routes = [
  getTagsRoute,
  getTagRoute,
  getRemovedTagsRoute,
  getMostUsedTagsRoute,
  getTagsWithSpendsRoute,
  downloadTagsWithSpendsRoute,
  createTagRoute,
  updateTagRoute,
  removeTagRoute,
  restoreTagRoute,
]
const prefix = '/tags'

export const tagsRoutes = registerPrefix(routes, prefix)
