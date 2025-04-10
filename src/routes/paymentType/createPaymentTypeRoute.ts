import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { PaymentTypeController } from '#/controller/PaymentTypeController'
import { db } from '#/drizzle/client'
import { StatusCodes } from '#/enums/status-code'
import { PaymentTypeAlreadyExistsError } from '#/errors/custom/PaymentTypeError'
import { catchError } from '#/utils/catchError'
import { insertPaymentTypeSchema } from '#/zod/paymentType'

export const createPaymentTypeRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/create',
    {
      schema: {
        summary: 'Create Payment Type',
        tags: ['Payment Types'],
        operationId: 'createPaymentType',
        body: z.object({
          name: z.string(),
          description: z.string().optional(),
        }),
        response: {
          [StatusCodes.CREATED]: insertPaymentTypeSchema,
          [StatusCodes.CONFLICT]: z.object({
            name: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, description } = request.body
      const paymentTypeController = new PaymentTypeController(db)

      const [error, data] = await catchError(
        paymentTypeController.createPaymentType({
          name,
          description,
        }),
        new PaymentTypeAlreadyExistsError()
      )

      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message,
        })
      }

      return reply.status(StatusCodes.CREATED).send(data)
    }
  )
}
