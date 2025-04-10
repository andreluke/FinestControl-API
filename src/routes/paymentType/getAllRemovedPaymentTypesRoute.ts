import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { PaymentTypeController } from '#/controller/PaymentTypeController'
import { db } from '#/drizzle/client'
import { StatusCodes } from '#/enums/status-code'
import { catchError } from '#/utils/catchError'
import { selectPaymentTypeSchema } from '#/zod/paymentType'

export const getRemovedPaymentTypesRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/all-removed',
    {
      schema: {
        summary: 'Get all removed Payment Types',
        tags: ['Payment Types'],
        operationId: 'getAllRemovedPaymentTypes',
        response: {
          [StatusCodes.OK]: z.object({
            paymentTypes: z.array(selectPaymentTypeSchema),
          }),
          [StatusCodes.INTERNAL_SERVER_ERROR]: z.object({
            name: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const paymentTypeController = new PaymentTypeController(db)

      const [error, data] = await catchError(
        paymentTypeController.getAllRemovedPaymentTypes()
      )

      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message,
        })
      }

      return reply.status(StatusCodes.OK).send({ paymentTypes: data })
    }
  )
}
