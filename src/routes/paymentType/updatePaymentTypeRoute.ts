import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { PaymentTypeController } from '#/controller/PaymentTypeController'
import { db } from '#/drizzle/client'
import { StatusCodes } from '#/enums/status-code'
import { PaymentTypeNotFoundError } from '#/errors/custom/PaymentTypeError'
import { catchError } from '#/utils/catchError'
import { updatePaymentTypeSchema } from '#/zod/paymentType'

export const updatePaymentTypeRoute: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/update',
    {
      schema: {
        summary: 'Update Payment Type',
        tags: ['Payment Types'],
        operationId: 'updatePaymentType',
        body: z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          icon: z.string().optional(),
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
      const { id, name, description, icon } = request.body
      const paymentTypeController = new PaymentTypeController(db)

      const [error, data] = await catchError(
        paymentTypeController.updatePaymentType({
          typeId: id,
          name,
          description,
          icon,
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
