import type { FastifyInstance } from 'fastify'
import pc from 'picocolors'
import { ZodError } from 'zod'
import { StatusCodes } from '#/enums/status-code'

export async function logger(app: FastifyInstance) {
  let startTime: number
  let messageName: string

  app.addHook('onRequest', (request, reply, done) => {
    startTime = Date.now()
    done()
  })

  app.addHook('onSend', (request, reply, payload, done) => {
    if (reply.statusCode >= StatusCodes.BAD_REQUEST) {
      const parsedPayload = JSON.parse(payload as string)

      if (parsedPayload?.name) {
        messageName = parsedPayload.name
      }
    }

    done()
  })

  app.addHook('onResponse', (request, reply, done) => {
    const responseTime = Date.now() - startTime
    const statusCode = reply.statusCode
    let statusColor = pc.green

    switch (true) {
      case statusCode >= StatusCodes.MULTIPLE_CHOICES &&
        statusCode < StatusCodes.BAD_REQUEST:
        statusColor = pc.yellow
        break
      case statusCode >= StatusCodes.BAD_REQUEST:
        statusColor = pc.red
        break
    }

    if (
      !request.url.includes('/docs') &&
      !request.url.includes('/favicon.ico')
    ) {
      console.info(
        pc.yellow('Response: ') +
          statusColor(
            `${request.method} ${request.url} - ${statusCode} - ${responseTime}ms ${messageName ? `- Error name: ${messageName}` : ''}`
          )
      )
    }

    messageName = ''
    done()
  })

  app.setErrorHandler((error, request, reply) => {
    if (error.code === 'FST_ERR_VALIDATION') {
      const validation = error.validation?.[0]

      return reply.status(StatusCodes.BAD_REQUEST).send({
        name: 'ValidationError',
        message: validation?.message || 'Erro de validação.',
      })
    }

    return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      name: 'InternalError',
      message: 'Algo deu errado.',
    })
  })
}
