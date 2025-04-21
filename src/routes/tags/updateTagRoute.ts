import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { TagsController } from '#/controller/TagsController'
import { db } from '#/drizzle/client'
import { StatusCodes } from '#/enums/status-code'
import { TagNotFoundError } from '#/errors/custom/TagError'
import { catchError } from '#/utils/catchError'
import { updateTagSchema } from '#/zod/tagSchema'

export const updateTagRoute: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/update',
    {
      schema: {
        summary: 'Update tag',
        tags: ['Tags'],
        operationId: 'updateTag',
        body: z.object({
          id: z.number(),
          name: z.string().optional(),
          color: z.string(),
          description: z.string().optional(),
          monthGoal: z.number().optional(),
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
      const { id, name, color, description, monthGoal } = request.body
      const tagsController = new TagsController(db)

      const [error, data] = await catchError(
        tagsController.updateTag({
          tagId: id,
          name,
          color,
          description,
          monthGoal,
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
