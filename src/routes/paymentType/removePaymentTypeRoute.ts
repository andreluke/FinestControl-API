import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { PaymentTypeController } from '#/controller/PaymentTypeController'
import { db } from '#/drizzle/client'
import { StatusCodes } from '#/enums/status-code'
import { PaymentTypeNotFoundError } from '#/errors/custom/PaymentTypeError'
import { catchError } from '#/utils/catchError'
import { updatePaymentTypeSchema } from '#/zod/paymentType'

export const removePaymentTypeRoute: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/remove/:id',
    {
      schema: {
        summary: 'Remove a Payment Type',
        tags: ['Payment Types'],
        operationId: 'removePaymentType',
        params: z.object({
          id: z.string(),
        }),
        response: {
          [StatusCodes.OK]: updatePaymentTypeSchema,
          [StatusCodes.NOT_FOUND]: z.object({
            name: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const paymentTypeController = new PaymentTypeController(db)
      const typeId = Number.parseInt(id)

      const [error, data] = await catchError(
        paymentTypeController.removePaymentType({
          typeId,
        }),
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
