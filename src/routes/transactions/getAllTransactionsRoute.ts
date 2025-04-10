import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { TransactionsController } from '#/controller/TransactionsController'
import { db } from '#/drizzle/client'
import { StatusCodes } from '#/enums/status-code'
import { catchError } from '#/utils/catchError'

const transactionSchema = z.object({
  id: z.number(),
  createdAt: z.date().nullable(),
  isSpend: z.boolean(),
  amount: z.number(),
  paymentType: z.string(),
  tagName: z.string(),
  tagColor: z.string(),
})

export const getAllTransactionsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/all',
    {
      schema: {
        summary: 'Get all transactions',
        tags: ['Transactions'],
        operationId: 'getAllTransactions',
        querystring: z.object({
          limit: z.string().optional(),
        }),
        response: {
          [StatusCodes.OK]: z.object({
            transactions: z.record(z.string(), z.array(transactionSchema)),
          }),
          [StatusCodes.INTERNAL_SERVER_ERROR]: z.object({
            name: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { limit: stringLimit } = request.query

      const limit = stringLimit ? Number.parseInt(stringLimit) : undefined

      const transactionsController = new TransactionsController(db)

      const [error, data] = await catchError(
        transactionsController.getAllTransactions({ limit })
      )

      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message,
        })
      }

      return reply.status(StatusCodes.OK).send({ transactions: data })
    }
  )
}
