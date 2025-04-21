import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { TransactionsController } from '#/controller/TransactionsController'
import { db } from '#/drizzle/client'
import { transactions } from '#/drizzle/schemas'
import { StatusCodes } from '#/enums/status-code'
import {
  MissingTransactionParamsError,
  TransactionNotFoundError,
} from '#/errors/custom/TransactionError'
import { catchError } from '#/utils/catchError'

export const getAllTransactionsTagRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/tag',
    {
      schema: {
        summary: 'Get all transactions from a specific tag',
        tags: ['Transactions'],
        operationId: 'getAllTransactionsByTag',
        querystring: z.object({
          tagId: z.string(),
          tagName: z.string().optional(),
        }),
        response: {
          [StatusCodes.OK]: z.object({
            transactions: z.array(
              z.object({
                id: z.number(),
                createdAt: z.date().nullable(),
                isSpend: z.boolean(),
                amount: z.number(),
                paymentType: z.string(),
                tagGoal: z.number(),
                tagName: z.string(),
                tagColor: z.string(),
              })
            ),
          }),
          [StatusCodes.BAD_REQUEST]: z.object({
            name: z.string(),
            message: z.string(),
          }),
          [StatusCodes.NOT_FOUND]: z.object({
            name: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { tagId: stringTagId, tagName } = request.query

      const transactionsController = new TransactionsController(db)

      const tagId = Number.parseInt(stringTagId)

      const [error, data] = await catchError(
        transactionsController.getAllTransactionsTag({
          tagId,
          tagName,
        }),
        new MissingTransactionParamsError(),
        new TransactionNotFoundError()
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
