import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { TagsController } from '#/controller/TagsController'
import { db } from '#/drizzle/client'
import { StatusCodes } from '#/enums/status-code'
import { catchError } from '#/utils/catchError'

export const getTagsWithSpendsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/with-spends',
    {
      schema: {
        summary: 'Get all tags with their monthly goal and monthly total spent',
        tags: ['Tags'],
        operationId: 'getAllTagsWithSpends',
        querystring: z.object({
          month: z
            .string()
            .refine(
              val => {
                const num = Number(val)
                return !Number.isNaN(num) && num >= 1 && num <= 12
              },
              {
                message: 'O mês deve ser um número entre 1 e 12.',
              }
            )
            .transform(val => Number(val)),
          year: z
            .string()
            .optional()
            .refine(
              val => {
                if (!val) return true
                const num = Number(val)
                return !Number.isNaN(num) && num > 0
              },
              {
                message: 'O ano deve ser um número válido.',
              }
            ),
        }),
        response: {
          [StatusCodes.OK]: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              color: z.string(),
              monthGoal: z.number(),
              total: z.number(),
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
      const { month, year: baseYear } = request.query

      const year = baseYear ? Number.parseInt(baseYear) : undefined
      const tagsController = new TagsController(db)

      const [error, data] = await catchError(
        tagsController.getTagsWithExpenses({ month, year })
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
