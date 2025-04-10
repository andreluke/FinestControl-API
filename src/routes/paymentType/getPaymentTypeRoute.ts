import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { PaymentTypeController } from '#/controller/PaymentTypeController'
import { db } from '#/drizzle/client'
import { StatusCodes } from '#/enums/status-code'
import {
  PaymentTypeMissingParamsError,
  PaymentTypeNotFoundError,
} from '#/errors/custom/PaymentTypeError'
import { catchError } from '#/utils/catchError'
import { selectPaymentTypeSchema } from '#/zod/paymentType'

export const getPaymentTypeRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '',
    {
      schema: {
        summary: 'Get Payment Type by id or name',
        tags: ['Payment Types'],
        operationId: 'getPaymentType',
        querystring: z.object({
          id: z.string().optional(),
          name: z.string().optional(),
        }),

        response: {
          [StatusCodes.OK]: selectPaymentTypeSchema,
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
      const { id, name } = request.query
      const paymentTypeController = new PaymentTypeController(db)

      const typeId = id ? Number.parseInt(id) : undefined

      const [error, data] = await catchError(
        paymentTypeController.getPaymentType({
          typeId,
          name,
        }),
        new PaymentTypeNotFoundError(),
        new PaymentTypeMissingParamsError()
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
