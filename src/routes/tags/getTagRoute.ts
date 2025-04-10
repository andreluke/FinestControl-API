import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { TagsController } from '#/controller/TagsController'
import { db } from '#/drizzle/client'
import { StatusCodes } from '#/enums/status-code'
import {
  MissingTagParamsError,
  TagNotFoundError,
} from '#/errors/custom/TagError'
import { catchError } from '#/utils/catchError'
import { selectTagSchema } from '#/zod/tagSchema'

export const getTagRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '',
    {
      schema: {
        summary: 'Get tag by id or name',
        tags: ['Tags'],
        operationId: 'getTag',
        querystring: z.object({
          id: z.string().optional(),
          name: z.string().optional(),
        }),

        response: {
          [StatusCodes.OK]: selectTagSchema,
          [StatusCodes.NOT_FOUND]: z.object({
            name: z.string(),
            message: z.string(),
          }),
          [StatusCodes.BAD_REQUEST]: z.object({
            name: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id, name } = request.query
      const tagsController = new TagsController(db)

      const tagId = id ? Number.parseInt(id) : undefined

      const [error, data] = await catchError(
        tagsController.getTag({
          tagId,
          name,
        }),
        new TagNotFoundError(),
        new MissingTagParamsError()
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
