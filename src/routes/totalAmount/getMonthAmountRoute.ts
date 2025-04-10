import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { TotalAmountController } from '#/controller/TotalAmountController'
import { db } from '#/drizzle/client'
import { StatusCodes } from '#/enums/status-code'
import { TotalAmountNotFoundError } from '#/errors/custom/TotalAmountError'
import { catchError } from '#/utils/catchError'
import { selectTotalAmountSchema } from '#/zod/totalAmountSchema'

export const getMonthAmountRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/month',
    {
      schema: {
        summary: 'Get total amount from a specific month',
        tags: ['Total Amount'],
        operationId: 'getMonthAmount',
        querystring: z.object({
          month: z.string().refine(
            val => {
              const num = Number(val)
              return !Number.isNaN(num) && num >= 1 && num <= 12
            },
            {
              message: 'O mês deve ser um número entre 1 e 12.',
            }
          ),
          year: z.string().optional(),
          last: z
            .string()
            .optional()
            .transform(value => {
              if (!value) return undefined
              const lowerVal = value.toLowerCase()
              if (lowerVal === 'true') return true
              if (lowerVal === 'false') return false
            }),
        }),
        response: {
          [StatusCodes.OK]: z.array(selectTotalAmountSchema),
          [StatusCodes.INTERNAL_SERVER_ERROR]: z.object({
            name: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { month, year, last } = request.query
      const totalAmountController = new TotalAmountController(db)

      const parsedMonth = Number.parseInt(month)
      const parsedYear = year ? Number.parseInt(year) : undefined

      const [error, data] = await catchError(
        totalAmountController.getMonthAmount({
          month: parsedMonth,
          year: parsedYear,
          last,
        }),
        new TotalAmountNotFoundError()
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
