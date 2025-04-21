import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { PaymentTypeController } from '#/controller/PaymentTypeController'
import { TagsController } from '#/controller/TagsController'
import { db } from '#/drizzle/client'
import { StatusCodes } from '#/enums/status-code'
import { catchError } from '#/utils/catchError'

export const getMostUsedPaymentTypesRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/most-used',
      {
        schema: {
          summary: 'Get most used payment types',
          tags: ['Payment Types'],
          operationId: 'getMostUsedPaymentTypes',
          querystring: z.object({
            limit: z.string().optional(),
          }),
          response: {
            [StatusCodes.OK]: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                icon: z.string(),
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
        const paymentTypeController = new PaymentTypeController(db)

        const [error, data] = await catchError(
          paymentTypeController.getMostUsedPaymentType({ limit: limitNumber })
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
