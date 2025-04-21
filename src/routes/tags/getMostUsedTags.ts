import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { TagsController } from '#/controller/TagsController'
import { db } from '#/drizzle/client'
import { StatusCodes } from '#/enums/status-code'
import { catchError } from '#/utils/catchError'
import { selectTagSchema } from '#/zod/tagSchema'

export const getMostUsedTagsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/most-used',
    {
      schema: {
        summary: 'Get most used tags',
        tags: ['Tags'],
        operationId: 'getMostUsedTags',
        querystring: z.object({
          limit: z.string().optional(),
        }),
        response: {
          [StatusCodes.OK]: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              color: z.string(),
              monthGoal: z.number(),
              usageCount: z.number(),
            })
          ),
          [StatusCodes.INTERNAL_SERVER_ERROR]: z.object({
            name: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { limit } = request.query
      const limitNumber = limit ? Number.parseInt(limit) : undefined
      const tagsController = new TagsController(db)

      const [error, data] = await catchError(
        tagsController.getMostUsedTags({ limit: limitNumber })
      )

      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message,
        })
      }

      return reply.status(StatusCodes.OK).send(data)
    }
  )
}
