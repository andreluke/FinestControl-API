import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { StatusCodes } from '#/enums/status-code'

export async function logger(app: FastifyInstance) {
  let startTime: number

  app.addHook('onRequest', (request, reply, done) => {
    request.log.info({ req: request }, 'Request received')
    startTime = Date.now()
    done()
  })

  app.addHook('onResponse', (request, reply, done) => {
    const responseTime = Date.now() - startTime
    const logPayload = {
      res: reply,
      responseTime,
      statusCode: reply.statusCode,
      url: request.url,
      method: request.method,
    }

    if (reply.statusCode >= StatusCodes.BAD_REQUEST) {
      request.log.error(logPayload, 'Response sent with error status')
    } else {
      request.log.info(logPayload, 'Response sent')
    }

    done()
  })

  app.setErrorHandler((error, request, reply) => {
    request.log.error(
      {
        err: error,
        url: request.url,
        method: request.method,
      },
      'Request errored'
    )

    if (error instanceof ZodError) {
      return reply.status(StatusCodes.BAD_REQUEST).send({
        name: 'ValidationError',
        message: error.errors[0]?.message ?? 'Erro de validação.',
      })
    }

    return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      name: 'InternalError',
      message: 'Algo deu errado.',
    })
  })
}
