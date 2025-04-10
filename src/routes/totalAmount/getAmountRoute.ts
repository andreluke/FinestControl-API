import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { TotalAmountController } from '#/controller/TotalAmountController'
import { db } from '#/drizzle/client'
import { StatusCodes } from '#/enums/status-code'
import { catchError } from '#/utils/catchError'
import { selectTotalAmountSchema } from '#/zod/totalAmountSchema'

export const getLastAmountRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/',
    {
      schema: {
        summary: 'Get last total amount',
        tags: ['Total Amount'],
        operationId: 'getLastAmount',
        response: {
          [StatusCodes.OK]: selectTotalAmountSchema,
          [StatusCodes.INTERNAL_SERVER_ERROR]: z.object({
            name: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const totalAmountController = new TotalAmountController(db)

      const [error, data] = await catchError(totalAmountController.getAmount())

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
