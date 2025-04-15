import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { TransactionsController } from '#/controller/TransactionsController'
import { db } from '#/drizzle/client'
import { StatusCodes } from '#/enums/status-code'
import { TransactionNotFoundError } from '#/errors/custom/TransactionError'
import { catchError } from '#/utils/catchError'

export const getAllTransactionsByMonthRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/month',
      {
        schema: {
          summary: 'Get all transactions from a specific month',
          tags: ['Transactions'],
          operationId: 'getAllTransactionsByMonth',
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
            [StatusCodes.OK]: z.object({
              month: z.number(),
              year: z.number(),
              transactions: z.object({
                spends: z.array(
                  z.object({
                    id: z.number(),
                    createdAt: z.date().nullable(),
                    isSpend: z.boolean(),
                    amount: z.number(),
                    paymentType: z.string(),
                    paymentTypeIcon: z.string(),
                    tagName: z.string(),
                    tagColor: z.string(),
                  })
                ),
                incomes: z.array(
                  z.object({
                    id: z.number(),
                    createdAt: z.date().nullable(),
                    isSpend: z.boolean(),
                    amount: z.number(),
                    paymentType: z.string(),
                    paymentTypeIcon: z.string(),
                    tagName: z.string(),
                    tagColor: z.string(),
                  })
                ),
                details: z.object({
                  totalSpends: z.number(),
                  totalIncomes: z.number(),
                  overallBalance: z.number(),
                }),
              }),
            }),
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
        const { month, year: baseYear } = request.query

        const year = baseYear ? Number.parseInt(baseYear) : undefined

        const transactionsController = new TransactionsController(db)

        const [error, data] = await catchError(
          transactionsController.getAllTransactionsByMonth({ month, year })
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
