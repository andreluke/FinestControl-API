import { registerPrefix } from '#/utils/registerPrefix'
import { createTagRoute } from './createTagRoute'
import { getRemovedTagsRoute } from './getAllRemovedTagsRoute'
import { getTagsRoute } from './getAllTagsRoute'
import { getTagRoute } from './getTagRoute'
import { removeTagRoute } from './removeTagRoute'
import { restoreTagRoute } from './restoreTagRoute'
import { updateTagRoute } from './updateTagRoute'

const routes = [
  getTagsRoute,
  getTagRoute,
  getRemovedTagsRoute,
  createTagRoute,
  updateTagRoute,
  removeTagRoute,
  restoreTagRoute,
]
const prefix = '/tags'

export const tagsRoutes = registerPrefix(routes, prefix)
