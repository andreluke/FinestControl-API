import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { TransactionsController } from '#/controller/TransactionsController'
import { db } from '#/drizzle/client'
import { StatusCodes } from '#/enums/status-code'
import { TransactionNotFoundError } from '#/errors/custom/TransactionError'
import { catchError } from '#/utils/catchError'

export const getTransactionRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '',
    {
      schema: {
        summary: 'Get a transaction by id',
        tags: ['Transactions'],
        operationId: 'getTransactionById',
        querystring: z.object({
          id: z.string(),
        }),
        response: {
          [StatusCodes.OK]: z.object({
            id: z.number(),
            createdAt: z.date().nullable(),
            isSpend: z.boolean(),
            amount: z.number(),
            paymentType: z.string(),
            tagName: z.string(),
            tagColor: z.string(),
          }),
          [StatusCodes.NOT_FOUND]: z.object({
            name: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.query
      const transactionsController = new TransactionsController(db)

      const transactionId = Number.parseInt(id)

      const [error, data] = await catchError(
        transactionsController.getTransaction({ transactionId }),
        new TransactionNotFoundError()
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
