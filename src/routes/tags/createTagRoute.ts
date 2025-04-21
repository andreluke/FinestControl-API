import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { TagsController } from '#/controller/TagsController'
import { db } from '#/drizzle/client'
import { StatusCodes } from '#/enums/status-code'
import {
  TagAlreadyExistsError,
  TagInvalidColor,
} from '#/errors/custom/TagError'
import { catchError } from '#/utils/catchError'
import { insertTagSchema } from '#/zod/tagSchema'

export const createTagRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/create',
    {
      schema: {
        summary: 'Create tag',
        tags: ['Tags'],
        operationId: 'createTag',
        body: z.object({
          name: z.string(),
          color: z.string(),
          description: z.string().optional(),
          monthGoal: z.number().optional(),
        }),
        response: {
          [StatusCodes.CREATED]: insertTagSchema,
          [StatusCodes.INTERNAL_SERVER_ERROR]: z.object({
            name: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, color, description, monthGoal } = request.body
      const tagsController = new TagsController(db)

      const [error, data] = await catchError(
        tagsController.createTag({
          name,
          color,
          description,
          monthGoal: monthGoal ?? 0,
        }),
        new TagAlreadyExistsError()
        // new TagInvalidColor(color ?? '')
      )

      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message,
        })
      }

      return reply.status(StatusCodes.CREATED).send(data)
    }
  )
}
