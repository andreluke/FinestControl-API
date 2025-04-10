import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { TagsController } from '#/controller/TagsController'
import { db } from '#/drizzle/client'
import { StatusCodes } from '#/enums/status-code'
import { catchError } from '#/utils/catchError'
import { selectTagSchema } from '#/zod/tagSchema'

export const getRemovedTagsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/all-removed',
    {
      schema: {
        summary: 'Get all removed tags',
        tags: ['Tags'],
        operationId: 'getAllRemovedTags',
        response: {
          [StatusCodes.OK]: z.object({
            tags: z.array(selectTagSchema),
          }),
          [StatusCodes.INTERNAL_SERVER_ERROR]: z.object({
            name: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const tagsController = new TagsController(db)

      const [error, data] = await catchError(tagsController.getAllRemovedTags())

      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message,
        })
      }

      return reply.status(StatusCodes.OK).send({ tags: data })
    }
  )
}
