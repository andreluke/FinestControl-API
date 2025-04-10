import { and, eq, isNotNull, isNull, sql } from 'drizzle-orm'
import type {
  CreateTagParams,
  GetTagParams,
  RemoveTagParams,
  UpdateTagParams,
} from '#/@types/controller/Tags'
import type { DbOrTx } from '#/@types/libs'
import { HexColor } from '#/class/HexColor'
import { tags } from '#/drizzle/schemas'
import {
  MissingTagParamsError,
  TagAlreadyExistsError,
  TagNotFoundError,
} from '#/errors/custom/TagError'

export class TagsController {
  private notRemovedCondition = () => isNull(tags.removedAt)
  constructor(private readonly db: DbOrTx) {}

  async getTag({ tagId, name, search }: GetTagParams) {
    if (!name && !tagId) {
      throw new MissingTagParamsError()
    }

    const id = tagId ?? 0

    const equal = name ? eq(tags.name, name) : eq(tags.id, id)

    const query = this.db.select().from(tags)

    const [tag] = await query.where(and(this.notRemovedCondition(), equal))

    if (!tag && !search) {
      throw new TagNotFoundError()
    }

    return tag
  }

  async getAllTags() {
    const query = this.db.select().from(tags).where(this.notRemovedCondition())

    const tagsList = await query

    return tagsList
  }

  async getAllRemovedTags() {
    const query = this.db.select().from(tags).where(isNotNull(tags.removedAt))

    const tagsList = await query

    return tagsList
  }

  async createTag({ name, color, description }: CreateTagParams) {
    const tagExists = await this.getTag({ name, search: true })

    if (tagExists) {
      throw new TagAlreadyExistsError()
    }

    const normalizedColor = color ? new HexColor(color).toString() : null

    const query = this.db
      .insert(tags)
      .values({ name, color: normalizedColor, description })
      .returning()

    const [tag] = await query

    return tag
  }

  async updateTag({ tagId, color, description, name }: UpdateTagParams) {
    const normalizedColor = color ? new HexColor(color).toString() : null

    const query = this.db
      .update(tags)
      .set({ color: normalizedColor, description, name })
      .where(and(this.notRemovedCondition(), eq(tags.id, tagId)))

    const [tag] = await query.returning()

    if (!tag) {
      throw new TagNotFoundError()
    }

    return tag
  }

  async removeTag({ tagId }: RemoveTagParams) {
    const query = this.db
      .update(tags)
      .set({ removedAt: new Date() })
      .where(and(this.notRemovedCondition(), eq(tags.id, tagId)))

    const [tag] = await query.returning()

    if (!tag) {
      throw new TagNotFoundError()
    }

    return tag
  }

  async restoreTag({ tagId }: RemoveTagParams) {
    const query = this.db
      .update(tags)
      .set({ removedAt: null })
      .where(and(isNotNull(tags.removedAt), eq(tags.id, tagId)))

    const [tag] = await query.returning()

    if (!tag) {
      throw new TagNotFoundError()
    }

    return tag
  }
}
