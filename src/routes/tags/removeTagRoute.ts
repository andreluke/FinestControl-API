import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { TagsController } from '#/controller/TagsController'
import { db } from '#/drizzle/client'
import { StatusCodes } from '#/enums/status-code'
import { TagNotFoundError } from '#/errors/custom/TagError'
import { catchError } from '#/utils/catchError'
import { updateTagSchema } from '#/zod/tagSchema'

export const removeTagRoute: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/remove/:id',
    {
      schema: {
        summary: 'Remove tag',
        tags: ['Tags'],
        operationId: 'removeTag',
        params: z.object({
          id: z.string(),
        }),
        response: {
          [StatusCodes.OK]: updateTagSchema,
          [StatusCodes.NOT_FOUND]: z.object({
            name: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const tagsController = new TagsController(db)

      const tagId = Number.parseInt(id)

      const [error, data] = await catchError(
        tagsController.removeTag({
          tagId,
        }),
        new TagNotFoundError()
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
