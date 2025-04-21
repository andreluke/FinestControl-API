import {
  and,
  count,
  desc,
  eq,
  gte,
  isNotNull,
  isNull,
  lte,
  sql,
  sum,
} from 'drizzle-orm'
import type {
  CreateTagParams,
  GetTagParams,
  RemoveTagParams,
  UpdateTagParams,
} from '#/@types/controller/Tags'
import type { GetMostUsedTagsParams } from '#/@types/controller/Tags/IGetMostUsedTags'
import type { GetTagsWithSpendsParams } from '#/@types/controller/Tags/IGetTagsWithSpends'
import type { DbOrTx } from '#/@types/libs'
import { HexColor } from '#/class/HexColor'
import { Money } from '#/class/Money'
import { tags, transactions } from '#/drizzle/schemas'
import {
  MissingTagParamsError,
  TagAlreadyExistsError,
  TagNotFoundError,
} from '#/errors/custom/TagError'

export class TagsController {
  private notRemovedCondition = () => isNull(tags.removedAt)
  constructor(private readonly db: DbOrTx) {}

  async getTagsWithExpenses({
    month,
    year: baseYear,
  }: GetTagsWithSpendsParams) {
    const year = baseYear ?? new Date().getFullYear()

    const monthStart = new Date(year, month - 1, 1)
    const monthEnd = new Date(year, month, 0, 23, 59, 59, 999)

    const query = this.db
      .select({
        id: tags.id,
        name: tags.name,
        color: tags.color,
        monthGoal: tags.monthGoal,
        total: sum(transactions.amount).as('total'),
      })
      .from(tags)
      .leftJoin(transactions, eq(tags.id, transactions.tagId))
      .where(
        and(
          gte(transactions.createdAt, monthStart),
          lte(transactions.createdAt, monthEnd)
        )
      )
      .groupBy(tags.id)
      .having(sql`bool_and(${transactions.isSpend})`)
      .orderBy(desc(sum(transactions.amount)))

    const result = await query

    const spends = result.map(tag => ({
      ...tag,
      total: Number.parseInt(tag.total ?? '0'),
    }))

    return spends
  }

  async getMostUsedTags({ limit }: GetMostUsedTagsParams) {
    const now = new Date()

    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0
    )
    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    )

    const query = this.db
      .select({
        id: tags.id,
        name: tags.name,
        color: tags.color,
        monthGoal: tags.monthGoal,
        usageCount: count(transactions.id).as('usage_count'),
      })
      .from(tags)
      .leftJoin(transactions, eq(tags.id, transactions.tagId))
      .groupBy(tags.id, tags.name)
      .orderBy(desc(count(transactions.id)))
      .where(
        and(
          gte(transactions.createdAt, monthStart),
          lte(transactions.createdAt, monthEnd)
        )
      )
      .limit(limit ?? 10)

    const tagsList = await query

    const filteredTagsList = tagsList.filter(tag => {
      return tag.usageCount > 0
    })

    return filteredTagsList
  }

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
    const query = this.db
      .select()
      .from(tags)
      .where(this.notRemovedCondition())
      .orderBy(desc(tags.createdAt))

    const tagsList = await query

    return tagsList
  }

  async getAllRemovedTags() {
    const query = this.db.select().from(tags).where(isNotNull(tags.removedAt))

    const tagsList = await query

    return tagsList
  }

  async createTag({ name, color, description, monthGoal }: CreateTagParams) {
    const tagExists = await this.getTag({ name, search: true })

    if (tagExists) {
      throw new TagAlreadyExistsError()
    }

    const goal = new Money(monthGoal)

    const normalizedColor = new HexColor(color).toString()

    const query = this.db
      .insert(tags)
      .values({
        name,
        color: normalizedColor,
        description,
        monthGoal: goal.getCents(),
      })
      .returning()

    const [tag] = await query

    return tag
  }

  async updateTag({
    tagId,
    color,
    description,
    name,
    monthGoal,
  }: UpdateTagParams) {
    if (name) {
      const tagExists = await this.getTag({ name, search: true })

      if (tagExists && tagExists.id !== tagId) {
        throw new TagAlreadyExistsError()
      }
    }

    const goal = monthGoal ? new Money(monthGoal) : undefined

    const normalizedColor = color ? new HexColor(color).toString() : undefined

    const query = this.db
      .update(tags)
      .set({
        color: normalizedColor,
        description,
        name,
        monthGoal: goal ? goal.getCents() : undefined,
        updatedAt: new Date(),
      })
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
