import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { TransactionsController } from '#/controller/TransactionsController'
import { db } from '#/drizzle/client'
import { StatusCodes } from '#/enums/status-code'
import { PaymentTypeNotFoundError } from '#/errors/custom/PaymentTypeError'
import { TagNotFoundError } from '#/errors/custom/TagError'
import { catchError } from '#/utils/catchError'
import { insertTransactionSchema } from '#/zod/transactionSchema'

export const createTransactionRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/create',
    {
      schema: {
        summary: 'Create a transaction',
        tags: ['Transactions'],
        operationId: 'createTransaction',
        body: z.object({
          amount: z.number(),
          isSpend: z.boolean(),
          paymentTypeId: z.number(),
          tagId: z.number(),
          createdAt: z.string().optional(),
        }),
        response: {
          [StatusCodes.OK]: insertTransactionSchema,
          [StatusCodes.NOT_FOUND]: z.object({
            name: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const {
        amount,
        isSpend,
        paymentTypeId,
        tagId,
        createdAt: createdAtStr,
      } = request.body
      const transactionsController = new TransactionsController(db)

      const createdAt = createdAtStr ? new Date(createdAtStr) : undefined

      const [error, data] = await catchError(
        transactionsController.createTransaction({
          amount,
          isSpend,
          paymentTypeId,
          tagId,
          createdAt,
        }),
        new TagNotFoundError(),
        new PaymentTypeNotFoundError()
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
