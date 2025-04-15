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
  paymentTypeIcon: z.string(),
  tagName: z.string(),
  tagColor: z.string(),
})

const monthlyTransactionSummarySchema = z.record(
  z.string(),
  z.object({
    spends: z.array(transactionSchema),
    incomes: z.array(transactionSchema),
    details: z.object({
      totalSpends: z.number(),
      totalIncomes: z.number(),
      overallBalance: z.number(),
    }),
  })
)

export const getAllTransactionsWithMonthRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/with-month',
      {
        schema: {
          summary: 'Get all transactions from a specific range of months',
          tags: ['Transactions'],
          operationId: 'getAllTransactionsWithMonth',
          querystring: z.object({
            month: z
              .string()
              .optional()
              .refine(
                val =>
                  val === undefined || (Number(val) >= 1 && Number(val) <= 12),
                {
                  message: 'O mês deve ser um número entre 1 e 12.',
                }
              )
              .transform(val => {
                const num = Number(val)
                return Number.isNaN(num) ? undefined : num
              }),
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
              )
              .transform(val => {
                const num = Number(val)
                return Number.isNaN(num) ? undefined : num
              }),
          }),
          response: {
            [StatusCodes.OK]: monthlyTransactionSummarySchema,
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
        const { month, year } = request.query

        const transactionsController = new TransactionsController(db)

        const [error, data] = await catchError(
          transactionsController.getAllTransactionsWithMonth({ month, year })
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
